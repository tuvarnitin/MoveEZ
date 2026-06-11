import {createSlice} from "@reduxjs/toolkit"
import {authService} from "../../services/auth.service"

const initialState = {
    isAuthenticated:false,
    isAuthModalOpen:false,
    currState:"login"
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginSuccess:(state,action)=>{
            state.isAuthenticated = true
        },
        onLogout:(state,action)=>{
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