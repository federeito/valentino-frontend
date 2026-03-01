import { mongooseconnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { MercadoPagoConfig, Payment } from "mercadopago";

// Initialize Mercado Pago configuration
const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

export default async function handler(req, res) {
    // Webhooks should only accept POST requests from Mercado Pago
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // Connect to your database
    await mongooseconnect();

    try {
        const { type, data } = req.body;

        console.log('Webhook received:', { type, data });

        // Check for the "payment" event type
        if (type === 'payment') {
            const paymentId = data.id;

            // Fetch the payment details from Mercado Pago
            const payment = new Payment(mercadopago);
            const paymentInfo = await payment.get({ id: paymentId });

            console.log('Payment info:', paymentInfo);

            // Check if the payment was approved
            if (paymentInfo.status === 'approved') {
                // Get order ID from external_reference or metadata
                const orderId = paymentInfo.external_reference || paymentInfo.metadata?.order_id;

                if (!orderId) {
                    console.error('No order ID found in payment');
                    return res.status(200).send('No order ID');
                }

                // Find the corresponding order in your database
                const order = await Order.findById(orderId);

                if (!order) {
                    console.error('Order not found:', orderId);
                    return res.status(200).send('Order not found');
                }

                // Check if the order was already marked as paid
                if (!order.paid) {
                    // Update the order's paid status and add to status history
                    order.paid = true;
                    order.statusHistory.push({
                        status: 'Pago confirmado',
                        timestamp: new Date(),
                        note: `Pago aprobado por MercadoPago - ID: ${paymentId}`
                    });
                    await order.save();

                    console.log('Order marked as paid:', orderId);

                    // Loop through each product in the order to decrement stock
                    for (const item of order.line_items) {
                        const productId = item.productId;
                        const quantityToDecrement = item.quantity;
                        
                        if (productId) {
                            // Find the product and decrement its stock using productId
                            const result = await Product.updateOne(
                                { _id: productId },
                                { $inc: { stock: -quantityToDecrement } }
                            );
                            
                            console.log(`Stock updated for product ${productId}:`, result);
                        }
                    }

                    console.log('Stock updated for all products');
                }
            } else {
                console.log('Payment not approved. Status:', paymentInfo.status);
            }
        }
        
        // Acknowledge the webhook successfully
        res.status(200).send('OK');
    } catch (error) {
        console.error("Error processing Mercado Pago webhook:", error);
        res.status(500).send('Internal Server Error');
    }
}