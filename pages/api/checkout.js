// Import necessary modules and models
import { mongooseconnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import nodemailer from 'nodemailer'; // Importamos Nodemailer

// Configuración de Mercado Pago
const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
    options: {
        sandbox: false,
    }
});

// Configuración de Nodemailer para el envío de correos
const transporter = nodemailer.createTransport({
    service: 'gmail', // Puedes usar otro servicio como 'hotmail', 'outlook', etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// Función para procesar los productos del carrito y manejar tanto el formato anterior como el nuevo
const processCartProducts = (cartProducts) => {
    const processedItems = {};

    cartProducts.forEach(item => {
        let productId, color;
        
        if (typeof item === 'object' && item.productId) {
            // Formato nuevo: { productId: 'id', color: { name: 'Rojo', code: '#ff0000' } }
            productId = item.productId;
            color = item.color;
        } else {
            // Formato anterior: string simple con el ID del producto
            productId = item;
            color = null;
        }

        // Crear una clave única que combine productId y color (si existe)
        const itemKey = color ? `${productId}-${color.name}` : productId;
        
        if (processedItems[itemKey]) {
            processedItems[itemKey].quantity += 1;
        } else {
            processedItems[itemKey] = {
                productId,
                color,
                quantity: 1,
                itemKey
            };
        }
    });

    return Object.values(processedItems);
};

// Define the default function for handling requests
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { email, name, address, city, state, zip, cartProducts, paymentMethod } = req.body;
    await mongooseconnect();

    // Procesar los productos del carrito para manejar tanto el formato anterior como el nuevo
    const processedCartItems = processCartProducts(cartProducts);
    
    // Obtener todos los IDs únicos de productos
    const uniqueProductIds = [...new Set(processedCartItems.map(item => item.productId))];
    
    // Buscar información de los productos en la base de datos
    const productsInfo = await Product.find({ _id: uniqueProductIds });

    let items = [];

    for (const cartItem of processedCartItems) {
        const productInfo = productsInfo.find(p => p._id.toString() === cartItem.productId);
        
        if (productInfo && cartItem.quantity > 0) {
            // Crear el título del item incluyendo el color si existe
            let itemTitle = productInfo.Título;
            if (cartItem.color) {
                itemTitle += ` - Color: ${cartItem.color.name}`;
            }

            items.push({
                title: itemTitle,
                quantity: cartItem.quantity,
                unit_price: productInfo.Precio,
                currency_id: "ARS",
                // Información adicional para el order
                productId: cartItem.productId,
                color: cartItem.color,
                originalTitle: productInfo.Título,
            });
        }
    }

    // Verificar que tengamos items válidos
    if (items.length === 0) {
        return res.status(400).json({ error: 'No se encontraron productos válidos en el carrito' });
    }

    // Crear los line_items para la orden (formato más detallado para guardar en la BD)
    const line_items = items.map(item => ({
        title: item.title,
        originalTitle: item.originalTitle,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
        productId: item.productId,
        color: item.color,
    }));

    // Lógica para manejar el método de pago seleccionado
    if (paymentMethod === 'mercadopago') {
        // Lógica de Mercado Pago
        const orderDoc = await Order.create({
            line_items,
            email,
            name,
            address,
            city,
            state,
            zip,
            paid: false,
            paymentMethod: 'mercadopago'
        });

        try {
            // Para Mercado Pago, solo necesitamos los datos básicos del item
            const mpItems = items.map(item => ({
                title: item.title,
                quantity: item.quantity,
                unit_price: item.unit_price,
                currency_id: "ARS",
            }));

            const preference = await new Preference(mercadopago).create({
                body: {
                    items: mpItems,
                    back_urls: {
                        success: `${process.env.SUCCESS_URL}/cart?success=1`,
                        failure: `${process.env.SUCCESS_URL}/cart?canceled=1`,
                        pending: `${process.env.SUCCESS_URL}/cart?pending=1`,
                    },
                    auto_return: "approved",
                    metadata: {
                        orderId: orderDoc._id.toString(),
                    }
                }
            });

            res.status(200).json({ url: preference.sandbox_init_point || preference.init_point });
        } catch (error) {
            console.error('Error al crear la preferencia de Mercado Pago:', error);
            res.status(500).json({ error: 'Error al procesar el pago con Mercado Pago' });
        }

    } else if (paymentMethod === 'transfer') {
        // Lógica para Transferencia Bancaria
        const orderDoc = await Order.create({
            line_items,
            email,
            name,
            address,
            city,
            state,
            zip,
            paid: false,
            paymentMethod: 'transfer'
        });

        // Calcular el total
        const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

        // Crear la lista de productos para el email
        const productList = items.map(item => 
            `<li>${item.title} - Cantidad: ${item.quantity} - Precio: $${item.unit_price.toLocaleString()} - Subtotal: $${(item.unit_price * item.quantity).toLocaleString()}</li>`
        ).join('');

        // Contenido del correo con los datos de la transferencia
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Confirmación de tu pedido #${orderDoc._id.toString().slice(-6)}`,
            html: `
                <h1>¡Gracias por tu pedido, ${name}!</h1>
                <img src="https://res.cloudinary.com/djuk4a84p/image/upload/v1755574026/valentino_logo_g5zdfg.png" alt="Valentino Paris Logo" style="max-width: 200px; margin: 20px 0;"/>
                
                <p>Tu pedido ha sido creado y está en espera de pago por transferencia bancaria.</p>
                
                <h2>Resumen del pedido:</h2>
                <ul>
                    ${productList}
                </ul>
                
                <p><strong>Total a pagar: $${total.toLocaleString()}</strong></p>
                
                <h2>Datos para la transferencia:</h2>
                <ul>
                    <li><strong>Titular:</strong> ${process.env.BANK_ACCOUNT_NAME}</li>
                    <li><strong>Número de cuenta:</strong> ${process.env.BANK_ACCOUNT_NUMBER}</li>
                    <li><strong>CBU:</strong> ${process.env.BANK_CBU}</li>
                    <li><strong>Alias:</strong> ${process.env.BANK_ALIAS}</li>
                </ul>
                
                <p><strong>Número de pedido:</strong> #${orderDoc._id.toString().slice(-6)}</p>
                <p>Por favor, incluye el número de pedido en el concepto de la transferencia y adjunta el comprobante de pago en respuesta a este correo para que podamos confirmar tu pedido.</p>
                
                <h2>Datos de envío:</h2>
                <p>
                    ${name}<br>
                    ${address}<br>
                    ${city}, ${state} ${zip}
                </p>
                
                <p>¡Muchas gracias por tu compra!</p>
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Correo de confirmación enviado a', email);
            res.status(200).json({ 
                orderId: orderDoc._id, 
                message: 'Orden creada, datos de transferencia enviados por correo.',
                total: total
            });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ error: 'Orden creada, pero falló el envío del correo de confirmación.' });
        }
    } else {
        res.status(400).json({ error: 'Método de pago no válido' });
    }
}