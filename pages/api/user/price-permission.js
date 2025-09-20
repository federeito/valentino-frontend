import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { mongooseconnect } from "@/lib/mongoose";
import { User } from "@/models/User";

// Admin emails that automatically have access to prices
const ADMIN_EMAILS = [
    'fedebojaminsky@gmail.com',
    'valentinobayres@hotmail.com'
];

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        
        // Explicitly handle no session case
        if (!session || !session.user || !session.user.email) {
            return res.status(200).json({ 
                canViewPrices: false,
                isApproved: false,
                isAdmin: false,
                message: 'Not authenticated' 
            });
        }

        await mongooseconnect();
        
        // Check if user is an admin
        const isAdmin = ADMIN_EMAILS.includes(session.user.email.toLowerCase());
        
        let user = await User.findOne({ email: session.user.email });
        
        if (!user) {
            // Create user if doesn't exist (first time login)
            user = await User.create({
                email: session.user.email,
                name: session.user.name,
                image: session.user.image,
                isApproved: isAdmin, // Auto-approve admins
                canViewPrices: isAdmin // Auto-grant price access to admins
            });
        } else if (isAdmin && (!user.isApproved || !user.canViewPrices)) {
            // Update existing admin users to have proper permissions
            user = await User.findByIdAndUpdate(
                user._id,
                {
                    isApproved: true,
                    canViewPrices: true,
                    approvedAt: new Date(),
                    approvedBy: 'system_admin'
                },
                { new: true }
            );
        }

        const canViewPrices = isAdmin || (user.canViewPrices && user.isApproved);

        return res.status(200).json({ 
            canViewPrices: canViewPrices,
            isApproved: isAdmin || user.isApproved,
            isAdmin: isAdmin,
            message: isAdmin ? 'Admin user' : (user.isApproved ? 'User approved' : 'User pending approval')
        });

    } catch (error) {
        console.error('Error checking price permission:', error);
        return res.status(500).json({ 
            canViewPrices: false,
            isApproved: false,
            isAdmin: false,
            message: 'Internal server error' 
        });
    }
}
