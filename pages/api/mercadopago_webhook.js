import { mongooseconnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { MercadoPagoConfig, Payment } from "mercadopago";

// Initialize Mercado Pago configuration
const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
    options: {
        sandbox: true,
    }
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

        // Check for the "payment" event type
        if (type === 'payment') {
            const paymentId = data.id;

            // Fetch the payment details from Mercado Pago
            const payment = new Payment(mercadopago);
            const paymentInfo = await payment.get({ id: paymentId });

            // Check if the payment was approved
            if (paymentInfo.status === 'approved') {
                const orderId = paymentInfo.metadata.orderId;

                // Find the corresponding order in your database
                const order = await Order.findById(orderId);

                // Check if the order was already marked as paid
                if (order && !order.paid) {
                    // Update the order's paid status
                    await Order.updateOne({ _id: orderId }, { paid: true });

                    // Loop through each product in the order to decrement stock
                    for (const item of order.line_items) {
                        const productTitle = item.title;
                        const quantityToDecrement = item.quantity;
                        
                        // Find the product and decrement its stock using $inc
                        await Product.updateOne(
                            { Título: productTitle }, // Find by title, assuming it's unique.
                            { $inc: { stock: -quantityToDecrement } }
                        );
                    }
                }
            }
        }
        
        // Acknowledge the webhook successfully
        res.status(200).send('Webhook Received');
    } catch (error) {
        console.error("Error processing Mercado Pago webhook:", error);
        res.status(500).send('Internal Server Error');
    }
}