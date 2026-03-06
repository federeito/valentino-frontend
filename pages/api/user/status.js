import { mongooseconnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    await mongooseconnect();
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    if (req.method === 'GET') {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ error: 'Email requerido' });
        }

        try {
            let user = await User.findOne({ email });
            
            // If user doesn't exist, create one
            if (!user) {
                user = await User.create({
                    email,
                    name: session.user.name,
                    image: session.user.image,
                    provider: session.user.provider || 'email',
                    isApproved: false,
                });
            }

            return res.status(200).json({
                isApproved: user.isApproved,
                canViewPrices: user.canViewPrices,
            });
        } catch (error) {
            console.error('Error fetching user status:', error);
            return res.status(500).json({ error: 'Error al obtener estado del usuario' });
        }
    }

    res.status(405).json({ error: 'Método no permitido' });
}
