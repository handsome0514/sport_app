import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {error: ''}

const errorApiReducer = createSlice({
  name: 'error-api',
  initialState,
  reducers: {
    changeError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload
    }
  }
})

export const { changeError } = errorApiReducer.actions
export default errorApiReducer.reducer
