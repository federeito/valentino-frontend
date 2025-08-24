import { mongooseconnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
    await mongooseconnect();
    
    if (req.method === 'POST') {
        const { ids } = req.body;

        try {
            // Validar que ids es un array
            if (!Array.isArray(ids)) {
                return res.status(400).json({ error: 'IDs must be an array' });
            }

            // Filtrar solo IDs válidos y únicos
            const validIds = [...new Set(ids.filter(id => id && typeof id === 'string'))];
            
            if (validIds.length === 0) {
                return res.json([]);
            }

            const products = await Product.find({_id: {$in: validIds}});
            res.json(products);
        } catch (error) {
            console.error('Error fetching cart products:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}