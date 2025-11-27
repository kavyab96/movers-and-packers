import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {}
  },
  reducers: {
    saveUser: (state,action) => {
        state.user = action.payload
    },
    //clear state variable when logout
    clearUser: (state) => {
      state.user ={}
    },
    
  }
})

// Action creators are generated for each case reducer function
export const { saveUser,clearUser } = userSlice.actions

export default userSlice.reducer