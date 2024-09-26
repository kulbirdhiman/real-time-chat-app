import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    userInfo : localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")):null
}
const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        setcredtionals : (state , action)=>{
            state.userInfo  = action.payload;
            localStorage.setItem("userInfo",JSON.stringify(action.payload))

        },

    }
})

export default authSlice.reducer
export const {setcredtionals} = authSlice.actions