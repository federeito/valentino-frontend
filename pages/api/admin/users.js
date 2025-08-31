import { mongooseconnect } from "@/lib/mongoose";
import { User } from "@/models/User";

// Admin emails that automatically have access to prices
const ADMIN_EMAILS = [
    'fedebojaminsky@gmail.com',
    'valentinobayres@hotmail.com'
];

export default async function handler(req, res) {
    await mongooseconnect();
    
    if (req.method === 'GET') {
        try {
            const users = await User.find({}).sort({ createdAt: -1 });
            
            // Add isAdmin flag to each user for the admin interface
            const usersWithAdminFlag = users.map(user => ({
                ...user.toObject(),
                isAdmin: ADMIN_EMAILS.includes(user.email.toLowerCase())
            }));
            
            return res.status(200).json(usersWithAdminFlag);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
    }
    
    if (req.method === 'PUT') {
        try {
            const { userId, isApproved, canViewPrices } = req.body;
            
            // Find the user first to check if they're an admin
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            // Don't allow changing admin permissions through this endpoint
            const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
            if (isAdmin) {
                return res.status(400).json({ 
                    error: 'Admin users cannot be modified through this endpoint' 
                });
            }
            
            const updateData = { isApproved, canViewPrices };
            if (isApproved) {
                updateData.approvedAt = new Date();
            }
            
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                updateData,
                { new: true }
            );
            
            return res.status(200).json(updatedUser);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update user' });
        }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
