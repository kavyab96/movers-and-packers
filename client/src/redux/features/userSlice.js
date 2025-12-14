import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {}
  },
  reducers: {
    saveUser: (state, action) => {
      state.user = action.payload
    },
    //clear state variable when logout
    clearUser: (state) => {
      state.user = {}
    },

    updateProfilePic: (state, action) => {
      if (state.user) {
        state.user.profile_pic = action.payload;
      }
    }

  }
})

// Action creators are generated for each case reducer function
export const { saveUser, clearUser,updateProfilePic } = userSlice.actions

export default userSlice.reducer