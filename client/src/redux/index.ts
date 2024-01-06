import { configureStore } from '@reduxjs/toolkit'

import errorServer from './reducer/errorApiReducer'
import guestNickName from './reducer/guestNickNameReducer'
import listTournament from './reducer/listTournamentReducer'
import tableTournament from './reducer/tableTournamentReducer'
import user from './reducer/userReducer'

export const store = configureStore({
  reducer: {
    user, listTournament, tableTournament, guestNickName, errorServer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
