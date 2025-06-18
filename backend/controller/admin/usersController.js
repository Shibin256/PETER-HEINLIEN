import User from "../../model/userModel.js";

export const getAllUsers = async (req, res) => {
    try {
        //pagination
        console.log(req)
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const query = { isAdmin: { $ne: true } };

        const [users,total]=await Promise.all([
            User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            User.countDocuments(query)
        ])

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
}

export const toggleUserBlock=async(req,res)=>{
    try {
        const user=await User.findById(req.params.id)

        if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user });

        
    } catch (error) {
         console.error('Error toggling user block status:', error.message);
    res.status(500).json({ message: 'Server error toggling block status' });
  }
}

export const deleteUser=async(req,res)=>{
    try {
        const user=await User.findById(req.params.id)

        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.deleteOne()
         res.status(200).json({ message: 'User deleted successfully' });        

    } catch (error) {
         console.error('Error when deleting user:', error.message);
    res.status(500).json({ message: 'Server error deleting user status' });
    }
}