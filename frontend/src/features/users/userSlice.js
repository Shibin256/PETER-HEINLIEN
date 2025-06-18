import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

//fetch users
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async ({ page = 1, limit = 10 }, thunkAPI) => {
        try {
            const res = await userService.getUsers(page, limit)
            console.log('000000000000000000000000', res)
            return res;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch failed');
        }
    }
);

//block and unblock handle
export const toggleUserBlock = createAsyncThunk(
    'users/toggleBlockUser',
    async (userId, { rejectWithValue }) => {
        try {
            const user = await userService.toggleUserBlock(userId);
            return user;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
)

//delete users
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            const res = await userService.deleteUser(userId)
            return res
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
)


const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        totalPages: 0,
        currentPage: 1,
        totalUsers: 0,
        loading: false,
        error: null,
    },
    reducers: {
        // add sync reducers if needed later
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                const { users, currentPage, totalPages, totalUsers } = action.payload;

                state.loading = false;
                state.users = users;
                state.currentPage = currentPage;
                state.totalPages = totalPages;
                state.totalUsers = totalUsers;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(toggleUserBlock.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                const index = state.users.findIndex((u) => u._id === updatedUser._id);
                if (index !== -1) {
                    state.users[index] = updatedUser;
                }
            })
            .addCase(toggleUserBlock.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
})


export default userSlice.reducer
