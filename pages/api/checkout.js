// Import necessary modules and models									  
import { mongooseconnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { MercadoPagoConfig, Preference } from 'mercadopago';


const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
    options: { 
        sandbox: false, 
    } 
  });

// Define the default function for handling requests													
export default async function handler(req, res) {
    // Check if the request method is not POST											
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });

    }

    // Destructure data from the request body										   
    const { email, name, address, city, state, zip, cartProducts } = req.body;

    // Connect to MongoDB using Mongoose									  
    await mongooseconnect();

    // Extract unique product IDs from the cart products													  
    const productIds = cartProducts;
    const uniqueIds = [...new Set(productIds)];

    // Retrieve information about products from the database using their IDs																		  
    const productsInfo = await Product.find({ _id: uniqueIds });

    let line_items = [];
    let items = [];

    // Loop through each unique product ID										
    for (const productId of uniqueIds) {
        // Find product information based on its ID											   
        const productInfo = productsInfo.find(p => p._id.toString() === productId);

        console.log('DEBUG: productInfo for ID', productId, productInfo);

        // Calculate the quantity of the product in the cart														
        const quantity = productIds.filter(id => id === productId)?.length || 0;

        if (quantity > 0 && productInfo) {
            // Push line item information to the line_items array
            items.push({
                title: productInfo.Título,
                quantity,
                unit_price: productInfo.Precio,
                currency_id: "ARS", // o USD, etc.
            });
        }
    }

    // Create a new order document in the database
    const orderDoc = await Order.create({
        line_items: items,
        email,
        name,
        address,
        city,
        state,
        zip,
        paid: false,
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
        console.error("Error al crear preferencia:", error);
        res.status(500).json({ error: "No se pudo generar la preferencia de Mercado Pago" });
    }
}