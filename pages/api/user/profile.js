import { mongooseconnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    try {
        await mongooseconnect();
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        const { email } = session.user;

        if (req.method === 'GET') {
            try {
                // Use findOneAndUpdate with upsert to avoid duplicate key errors
                const user = await User.findOneAndUpdate(
                    { email },
                    { 
                        $setOnInsert: {
                            email,
                            name: session.user.name,
                            image: session.user.image,
                            provider: session.user.provider || 'email',
                            isApproved: false,
                            firstName: '',
                            lastName: '',
                            phone: '',
                            cuitCuil: '',
                            businessName: '',
                            shippingAddress: '',
                        }
                    },
                    { 
                        new: true, 
                        upsert: true,
                        setDefaultsOnInsert: true
                    }
                );

                return res.status(200).json({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    phone: user.phone || '',
                    cuitCuil: user.cuitCuil || '',
                    businessName: user.businessName || '',
                    shippingAddress: user.shippingAddress || '',
                });
            } catch (error) {
                console.error('Error fetching user profile:', error);
                return res.status(500).json({ error: 'Error al obtener perfil: ' + error.message });
            }
        }

        if (req.method === 'PUT') {
            const { firstName, lastName, phone, cuitCuil, businessName, shippingAddress } = req.body;

            try {
                const user = await User.findOneAndUpdate(
                    { email },
                    { 
                        $set: {
                            firstName: firstName || '',
                            lastName: lastName || '',
                            phone: phone || '',
                            cuitCuil: cuitCuil || '',
                            businessName: businessName || '',
                            shippingAddress: shippingAddress || '',
                        },
                        $setOnInsert: {
                            email,
                            name: session.user.name,
                            image: session.user.image,
                            provider: session.user.provider || 'email',
                            isApproved: false,
                        }
                    },
                    { 
                        new: true, 
                        upsert: true,
                        runValidators: true,
                        setDefaultsOnInsert: true
                    }
                );

                return res.status(200).json({
                    message: 'Perfil actualizado exitosamente',
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    phone: user.phone || '',
                    cuitCuil: user.cuitCuil || '',
                    businessName: user.businessName || '',
                    shippingAddress: user.shippingAddress || '',
                });
            } catch (error) {
                console.error('Error updating user profile:', error);
                return res.status(500).json({ error: 'Error al actualizar perfil: ' + error.message });
            }
        }

        res.status(405).json({ error: 'Método no permitido' });
    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({ error: 'Error del servidor: ' + error.message });
    }
}
