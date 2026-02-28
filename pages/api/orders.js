import { mongooseconnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handle(req, res) {
  await mongooseconnect();

  if (req.method === 'GET') {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      const orders = await Order.find({ email })
        .sort({ createdAt: -1 })
        .lean();
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
