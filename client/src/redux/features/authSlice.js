import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    user:null,
    isAuthenticated:false,
    isAuthModalOpen:false,
    currState:"login"
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginSuccess:(state,action)=>{
            state.user = action.payload.user
            state.isAuthenticated = true
            localStorage.setItem("name",action.payload.user.name)
        },
        onLogout:(state,action)=>{
            state.user = null
            state.isAuthenticated = false
            localStorage.clear()
        },
        openAuthModal:(state)=>{
            state.isAuthModalOpen = true
        },
        closeAuthModal:(state)=>{
            state.isAuthModalOpen = false
        },
        setCurrState:(state,action)=>{
            state.currState = action.payload.state
        }
    }
})

export const { loginSuccess, onLogout, openAuthModal, closeAuthModal, setCurrState } = authSlice.actions
export default authSlice.reducer