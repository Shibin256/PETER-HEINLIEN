import {createSlice} from '@reduxjs/toolkit'

const initialState={
    user:localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,

     admin: localStorage.getItem("admin")
    ? JSON.parse(localStorage.getItem("admin"))
    : null,

    token:localStorage.getItem('token') || null,
    isAuthenticated:!!localStorage.getItem('token'),
    isAdmin: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem('user'))?.isAdmin || false
    : false
}


const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
    setUser:(state,action)=>{
    const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isAdmin = user?.isAdmin || false;
      console.log(state.isAuthenticated,'isauth')
      console.log(state.isdmin,'isadmin')
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
    }
    }
})

export const {setUser,setAdmin,logout}=authSlice.actions;
export default authSlice.reducer