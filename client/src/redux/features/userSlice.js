import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    data: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.data = action.payload.user
            localStorage.setItem("name", action.payload.user.name)
        },
        clearUserData:(state,action) => {
            state.data = null
            localStorage.clear()
        }
    }
})

export const { setUserData, clearUserData } = userSlice.actions
export default userSlice.reducer