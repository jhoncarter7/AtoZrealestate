import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    loading: false,
    error: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        signInStart: (state)=>{
            state.loading = true
        },
        signInSuccess: (state, action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action)=>{
            state.error = action.payload;
            state.loading = false;
            
        },
        userUpdateStart: (state)=> {
            state.loading = true
        },
        userUpdateSuccess:(state, action)=>{
          state.currentUser = action.payload
          state.loading = false
          state.error = null
        },
        userUpdateFailure: (state, action)=> {
            state.error = action.payload
            state.loading = false
        },
        userDeleteStart: (state) =>{
            state.loading = true
        },
        userDeleteSuccess: (state)=>{
            state.currentUser = null,
            state.loading = false,
            state.error = false
        }, 
        userDeleteFailure:(state, action)=>{
            state.error = action.payload
        },
        signoutStart: (state) =>{
            state.loading = true
        },
        signoutSuccess: (state)=>{
            state.currentUser = null,
            state.loading = false,
            state.error = false
        }, 
        signoutFailure:(state, action)=>{
            state.error = action.payload
        },

    }
});

export const  {signInStart, signInSuccess,signInFailure, userUpdateStart, userUpdateSuccess, userUpdateFailure, userDeleteStart, userDeleteSuccess, userDeleteFailure, signoutStart, signoutFailure, signoutSuccess} = userSlice.actions;

export default userSlice.reducer