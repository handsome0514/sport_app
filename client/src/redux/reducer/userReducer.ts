import {
 createAsyncThunk, createSlice, current, PayloadAction 
} from '@reduxjs/toolkit'

import $api from '../../http/index'

interface userState {
  user_id: string | null
  user_email: string | null
  name: string | null
  nickname: string | null
  phone: string | null
  isLoading: boolean
  error: string | [] | null
  sharingId: string | null
  atpStanding: number,
  playedGames: number,
  wins: number,
  trophies: number
}

const initialState: userState = {
  user_id: null,
  user_email: null,
  name: null,
  nickname: null,
  phone: null,
  isLoading: false,
  error: null,
  sharingId: null,
  atpStanding: 0,
  playedGames: 0,
  wins: 0,
  trophies: 0
}

export const actionUserAuth = createAsyncThunk(
  'user/actionUserAuth',
  async(_, { rejectWithValue }) => {
    try {
      const { data } = await $api.get('user/refresh')
      localStorage.setItem('token', data.accessToken)
      return data.user
    } catch (error: any) {
      if (!error.response) {
        // console.log('asfafaf');
      }
      return rejectWithValue(error.response.data.message)
    }
  },
)

export const actionUserLogin = createAsyncThunk(
  'user/actionUserLogin',
  async(
    { user_email, password }: { user_email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await $api.post('user/login', { user_email, password })
      localStorage.setItem('token', data.accessToken)
      return data.user
    } catch (error: any) {
      return rejectWithValue(error.response.data.message)
    }
  },
)

export const actionUserRegistration = createAsyncThunk(
  'user/actionUserRegistration',
  async(
    {
      user_email,
      password,
      subscribe,
    }: { user_email: string; password: string; subscribe: boolean },
    { rejectWithValue },
  ) => {
    try {
     await $api.post('user/registration', {
        user_email,
        password,
        subscribe,
      })
    } catch (error: any) {
      return rejectWithValue(error.response.data.message)
    }
  },
)

export const actionUserLogout = createAsyncThunk(
  'user/actionUserLogout',
  async(_, { rejectWithValue }) => {
    try {
      const { data } = await $api.post('user/logout')
      localStorage.removeItem('token')
      return data.user
    } catch (error: any) {
      return rejectWithValue(error.response.data.message)
    }
  },
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    //AUTH
    [actionUserAuth.pending.type]: (state) => {
      state.isLoading = true
    },
    [actionUserAuth.fulfilled.type]: (
      state,
      { payload }: PayloadAction<any>,
    ) => {
      state.isLoading = false
      state.user_email = payload.email
      state.name = payload.name
      state.phone = payload.phone
      state.user_id = payload._id
      state.nickname = payload.nickname
      state.sharingId = payload.sharingId
    },
    [actionUserAuth.rejected.type]: (
      state,
      { payload }: PayloadAction<string>,
    ) => {
      state.isLoading = false
    },
    //LOGIN
    [actionUserLogin.pending.type]: (state) => {
      state.isLoading = true
    },
    [actionUserLogin.fulfilled.type]: (
      state,
      { payload }: PayloadAction<any>,
    ) => {
      state.isLoading = false
      state.user_email = payload.email
      state.name = payload.name
      state.phone = payload.phone
      state.user_id = payload._id
      state.nickname = payload.nickname
      state.sharingId = payload.sharingId
    },
    [actionUserLogin.rejected.type]: (
      state,
      { payload }: PayloadAction<string>,
    ) => {
      state.isLoading = false
      state.error = payload
    },
    //REGISTRATION
    [actionUserRegistration.pending.type]: (state) => {
      state.isLoading = true
    },
    [actionUserRegistration.fulfilled.type]: (
      state,
      { payload }: PayloadAction<any>,
    ) => {
       state.isLoading = false
    },
    [actionUserRegistration.rejected.type]: (
      state,
      { payload }: PayloadAction<string>,
    ) => {
      state.isLoading = false
      state.error = payload
    },
    //LOGOUT
    [actionUserLogout.pending.type]: (state) => {
      state.isLoading = true
    },
    [actionUserLogout.fulfilled.type]: (state) => {
      state.isLoading = false
      state.user_id = null
      state.user_email = null
      state.name = null
      state.nickname = null
      state.phone = null
      state.error = null
      state.sharingId = null
    },
    [actionUserLogout.rejected.type]: (
      state,
      { payload }: PayloadAction<string>,
    ) => {
      state.isLoading = false
      state.error = payload
    },
  },
})

export default userSlice.reducer
