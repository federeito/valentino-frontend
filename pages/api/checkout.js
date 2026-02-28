// Import necessary modules and models
import { mongooseconnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import nodemailer from 'nodemailer';

// Configuración de Mercado Pago
const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
    options: {
        sandbox: false,
    }
});

// Configuración de Nodemailer con SMTP de MailerSend
const transporter = nodemailer.createTransport({
    host: process.env.MAILERSEND_SMTP_HOST || 'smtp.mailersend.net',
    port: parseInt(process.env.MAILERSEND_SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAILERSEND_SMTP_USER,
        pass: process.env.MAILERSEND_SMTP_PASS,
    },
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

            // Access código from the raw MongoDB document to handle accented characters
            const productCode = productInfo.toObject?.()?.código || 
                               productInfo._doc?.código || 
                               productInfo['código'] || 
                               'N/A';

            items.push({
                title: itemTitle,
                quantity: cartItem.quantity,
                unit_price: productInfo.Precio,
                currency_id: "ARS",
                productId: cartItem.productId,
                color: cartItem.color || null,
                originalTitle: productInfo.Título,
                código: productCode,
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
        color: item.color || null,
        código: item.código,
    }));

    // Lógica para manejar el método de pago seleccionado
    if (paymentMethod === 'mercadopago') {
        // Lógica de Mercado Pago
        const orderData = {
            line_items,
            email,
            name,
            address,
            city,
            state,
            zip,
            paid: false,
            paymentMethod: 'mercadopago',
            statusHistory: [{
                status: 'Pendiente',
                timestamp: new Date(),
                note: 'Pedido creado - Esperando pago de MercadoPago'
            }]
        };
        
        const orderDoc = await Order.create(orderData);

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
            line_items: line_items,
            email: email,
            name: name,
            address: address,
            city: city,
            state: state,
            zip: zip,
            paid: false,
            paymentMethod: paymentMethod,
            statusHistory: [{
                status: 'Pendiente',
                timestamp: new Date(),
                note: 'Pedido creado - Esperando transferencia bancaria'
            }]
        });

        // Calcular el total
        const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
        const discount = total * 0.10; // 10% discount for bank transfer
        const finalTotal = total - discount;

        // Crear la lista de productos para el email
        const productList = items.map(item => 
            `<li style="margin-bottom: 10px;">
                <strong>${item.title}</strong> (COD: ${item.código})<br>
                Cantidad: ${item.quantity} - Precio: $${item.unit_price.toLocaleString()} - Subtotal: $${(item.unit_price * item.quantity).toLocaleString()}
            </li>`
        ).join('');

        // HTML content for the email
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { max-width: 200px; margin: 20px 0; }
                    .section { margin-bottom: 30px; }
                    .bank-info { background-color: #f5f5f5; padding: 20px; border-radius: 8px; }
                    .bank-info li { margin-bottom: 10px; }
                    .total { font-size: 18px; font-weight: bold; color: #2c5f2d; }
                    .discount { color: #16a34a; font-weight: bold; }
                    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>¡Gracias por tu pedido, ${name}!</h1>
                        <img src="https://res.cloudinary.com/djuk4a84p/image/upload/v1755574026/valentino_logo_g5zdfg.png" alt="Valentino Paris Logo" class="logo"/>
                    </div>
                    
                    <div class="section">
                        <p>Tu pedido ha sido creado y está en espera de pago por transferencia bancaria.</p>
                        <p><strong>Número de pedido:</strong> #${orderDoc._id.toString().slice(-6)}</p>
                    </div>
                    
                    <div class="section">
                        <h2>Resumen del pedido:</h2>
                        <ul>
                            ${productList}
                        </ul>
                        
                        <p><strong>Subtotal:</strong> $${total.toLocaleString()}</p>
                        <p class="discount"><strong>Descuento (10% por transferencia):</strong> -$${discount.toLocaleString()}</p>
                        <p class="total">Total a pagar: $${finalTotal.toLocaleString()}</p>
                    </div>
                    
                    <div class="section bank-info">
                        <h2>Datos para la transferencia:</h2>
                        <ul>
                            <li><strong>Titular:</strong> ${process.env.BANK_ACCOUNT_NAME}</li>
                            <li><strong>Número de cuenta:</strong> ${process.env.BANK_ACCOUNT_NUMBER}</li>
                            <li><strong>CBU:</strong> ${process.env.BANK_CBU}</li>
                            <li><strong>Alias:</strong> ${process.env.BANK_ALIAS}</li>
                        </ul>
                        <p style="margin-top: 15px;"><strong>⚠️ Importante:</strong> Por favor, incluye el número de pedido <strong>#${orderDoc._id.toString().slice(-6)}</strong> en el concepto de la transferencia.</p>
                    </div>
                    
                    <div class="section">
                        <h2>Datos de envío:</h2>
                        <p>
                            ${name}<br>
                            ${address}<br>
                            ${city}, ${state} ${zip}
                        </p>
                    </div>
                    
                    <div class="section">
                        <p>Una vez realizada la transferencia, por favor envía el comprobante de pago respondiendo a este correo para que podamos confirmar y procesar tu pedido.</p>
                    </div>
                    
                    <div class="footer">
                        <p>¡Muchas gracias por tu compra!</p>
                        <p style="font-size: 12px; color: #999;">Valentino Paris - Venta Mayorista de Marroquinería</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Configuración del correo
        const mailOptions = {
            from: `"${process.env.MAILERSEND_FROM_NAME || 'Valentino Paris'}" <${process.env.MAILERSEND_FROM_EMAIL}>`,
            to: email,
            subject: `Confirmación de tu pedido #${orderDoc._id.toString().slice(-6)}`,
            html: htmlContent,
        };

        try {
            await transporter.sendMail(mailOptions);
            
            res.status(200).json({ 
                orderId: orderDoc._id, 
                message: 'Orden creada, datos de transferencia enviados por correo.',
                total: finalTotal,
                discount: discount
            });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ error: 'Orden creada, pero falló el envío del correo de confirmación.' });
        }
    } else {
        res.status(400).json({ error: 'Método de pago no válido' });
    }
}