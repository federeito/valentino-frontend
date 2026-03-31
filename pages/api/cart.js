import { mongooseconnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
    await mongooseconnect();
    
    if (req.method === 'POST') {
        const { ids } = req.body;

        try {
            if (!Array.isArray(ids)) {
                return res.status(400).json({ error: 'IDs must be an array' });
            }

            const validIds = [...new Set(ids.filter(id => id && typeof id === 'string'))];
            
            if (validIds.length === 0) {
                return res.json([]);
            }

            const products = await Product.find({_id: {$in: validIds}});

            const lineaEconomicaCategory = await Category.findOne({ 
                name: { $regex: /l[ií]nea\s*econ[oó]mica/i } 
            });

            const lineaEconomicaId = lineaEconomicaCategory?._id?.toString();

            const productsWithCategory = products.map(p => {
                const obj = p.toObject();
                const productCategoryId = (
                    obj.Categoria?.toString() ||
                    obj.category?.toString() ||
                    obj.Categoría?.toString() ||
                    obj.categoria?.toString() ||
                    ''
                );
                obj.isLineaEconomica = !!(lineaEconomicaId && productCategoryId === lineaEconomicaId);
                return obj;
            });

            res.json(productsWithCategory);
        } catch (error) {
            console.error('Error fetching cart products:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}