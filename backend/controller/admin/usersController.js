import User from "../../model/userModel.js";

//fetching all users logged in
export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        const query = { isAdmin: { $ne: true } };

        let [users, total] = await Promise.all([
            User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            User.countDocuments(query)
        ]);

        if (search) {
            const regex = new RegExp(search, 'i');
            users = users.filter(user =>
                regex.test(user.username) || regex.test(user.email)
            );
        }

        res.status(200).json({
            users,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalUsers: total
        });
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};


// users block and upblock part
export const toggleUserBlock = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.status(200).json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user: user });

    } catch (error) {
        console.error('Error toggling user block status:', error.message);
        res.status(500).json({ message: 'Server error toggling block status' });
    }
}

//user delete section
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.deleteOne()
        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        console.error('Error when deleting user:', error.message);
        res.status(500).json({ message: 'Server error deleting user status' });
    }
}