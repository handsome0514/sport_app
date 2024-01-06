import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface guestNickNameState {
    nickName: string | null
}
const initialState: guestNickNameState = {nickName: localStorage.getItem('nickName') || null}

const guestNickNameSlice = createSlice({
  name: 'guest',
  initialState,
  reducers: {
    guestNickNameActionChange: (state, {payload}: PayloadAction<string>) => {
      state.nickName = payload
    }
  }
})

export const {guestNickNameActionChange} = guestNickNameSlice.actions
export default guestNickNameSlice.reducer
