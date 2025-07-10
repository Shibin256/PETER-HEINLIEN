import adminAxiosInstance from "../../api/adminAxiosInstance";
import axiosInstance from "../../api/axiosInstance";

//fetch users
const getUsers=async(page,limit,search)=>{
    const params = new URLSearchParams({ page, limit });
    if (search) {
        params.append('search', search);
    }
    
    const res=await adminAxiosInstance.get(`/api/admin/users/get`,{
        params: params,
    })
    return res.data
}
//block and ublock user
const toggleUserBlock=async(userId)=>{
    const res= await adminAxiosInstance.patch(`/api/admin/block-toggle/${userId}`)
    return res.data
}
//delete user
const deleteUser=async(userId)=>{
    const res=await adminAxiosInstance.delete(`/api/admin/delete/${userId}`)
    return res.data
}

const userService={
    getUsers,
    toggleUserBlock,
    deleteUser
}

export default userService