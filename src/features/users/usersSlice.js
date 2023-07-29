import { createSlice } from "@reduxjs/toolkit";

const initialState = [
    { id : '0', name: 'Once'},
    { id : '1', name: 'Potato'},
    { id : '2', name: 'Devil'},
]

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers : {

    }
})


export const selectAllUsers = (state) => state.users; 

export default usersSlice.reducer;
