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

// Define the default function for handling requests
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { email, name, address, city, state, zip, cartProducts, paymentMethod } = req.body;
    await mongooseconnect();

    const productIds = cartProducts;
    const uniqueIds = [...new Set(productIds)];

    const productsInfo = await Product.find({ _id: uniqueIds });

    let items = [];

    for (const productId of uniqueIds) {
        const productInfo = productsInfo.find(p => p._id.toString() === productId);
        const quantity = productIds.filter(id => id === productId)?.length || 0;

        if (quantity > 0 && productInfo) {
            items.push({
                title: productInfo.Título,
                quantity,
                unit_price: productInfo.Precio,
                currency_id: "ARS",
            });
        }
    }

    // Lógica para manejar el método de pago seleccionado
    if (paymentMethod === 'mercadopago') {
        // Lógica de Mercado Pago
        const orderDoc = await Order.create({
            line_items: items,
            email,
            name,
            address,
            city,
            state,
            zip,
            paid: false,
            paymentMethod: 'mercadopago' // Agrega el método de pago al documento
        });

        try {
            const preference = await new Preference(mercadopago).create({
                body: {
                    items,
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
            line_items: items,
            email,
            name,
            address,
            city,
            state,
            zip,
            paid: false,
            paymentMethod: 'transfer' // Agrega el método de pago al documento
        });

        // Contenido del correo con los datos de la transferencia
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Confirmación de tu pedido #${orderDoc._id}`,
            html: `
                <h1>¡Gracias por tu pedido, ${name}!</h1>
                <p>Tu pedido ha sido creado y está en espera de pago por transferencia bancaria.</p>
                <p><strong>Total a pagar: $${items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)}</strong></p>
                <p>Por favor, realiza la transferencia a la siguiente cuenta:</p>
                <ul>
                    <li><strong>Titular:</strong> ${process.env.BANK_ACCOUNT_NAME}</li>
                    <li><strong>Número de cuenta:</strong> ${process.env.BANK_ACCOUNT_NUMBER}</li>
                    <li><strong>CBU:</strong> ${process.env.BANK_CBU}</li>
                    <li><strong>Alias:</strong> ${process.env.BANK_ALIAS}</li>
                </ul>
                <p>Por favor, adjunta el comprobante de pago en respuesta a este correo para que podamos confirmar tu pedido.</p>
                <p>¡Muchas gracias por tu compra!</p>
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Correo de confirmación enviado a', email);
            res.status(200).json({ orderId: orderDoc._id, message: 'Orden creada, datos de transferencia enviados por correo.' });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ error: 'Orden creada, pero falló el envío del correo de confirmación.' });
        }
    } else {
        res.status(400).json({ error: 'Método de pago no válido' });
    }
}