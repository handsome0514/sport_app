import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export type TournamentStates = 'Upcoming' | 'Ongoing' | 'Finished' | 'Drafts'

interface listTournamentState {
  status: TournamentStates;
}
const initialState: listTournamentState = {status: 'Upcoming',}

export const listTournamentSlice = createSlice({
  name: 'list-tournament',
  initialState,
  reducers: {
    actionChangeListTournament: (state, { payload }: PayloadAction<TournamentStates>) => {
      state.status = payload
    }
  }
})

export const { actionChangeListTournament } = listTournamentSlice.actions
export default listTournamentSlice.reducer
