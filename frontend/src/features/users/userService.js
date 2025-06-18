import axiosInstance from "../../api/axiosInstance";

//fetch users
const getUsers=async(page,limit)=>{
    const res=await axiosInstance.get(`/api/admin/users/get?page=${page}&limit=${limit}`)
    return res.data
}
//block and ublock user
const toggleUserBlock=async(userId)=>{
    const res= await axiosInstance.patch(`/api/admin/block-toggle/${userId}`)
    return res.data
}
//delete user
const deleteUser=async(userId)=>{
    const res=await axiosInstance.delete(`/api/admin/delete/${userId}`)
    return res.data
}

const userService={
    getUsers,
    toggleUserBlock,
    deleteUser
}

export default userService