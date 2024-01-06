import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import $api from '../../http';
import { ITournamentData, ITournaments } from '../../interface';
import { tournamentTable } from '../../services/tournamentService';

interface ITournamentState {
  _id: string;
  additional: string;
  code_link: string;
  creator: string;
  date: string;
  drafts: boolean;
  ended_at: null;
  name: string;
  participants: number;
  place: string | null;
  playtime: null;
  rules: null;
  started: boolean;
  tournament_bracket: tournamentTable[];
  players: any;
  isLoading: boolean;
  error: boolean;
  classic: boolean;
  started_at: null;
  elo: boolean;
}

const initialState: ITournamentState = {
  _id: '',
  additional: '',
  code_link: '',
  creator: '',
  date: '',
  drafts: false,
  ended_at: null,
  name: '',
  participants: 2,
  place: '',
  playtime: null,
  rules: null,
  started: false,
  tournament_bracket: [],
  players: [],
  isLoading: false,
  error: false,
  classic: false,
  started_at: null,
  elo: false,
};

export const tableTournamentActionFetch = createAsyncThunk(
  'table/tableTournamentActionFetch',
  async(id: string, { rejectWithValue }) => {
    try {
      const { data } = await $api.get<ITournamentData>(`/tournaments/${id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const tableTournamentActionUpdate = createAsyncThunk(
  'table/tableTournamentActionUpdate',
  async(
    {
      id,
      tournament_bracket,
      started,
      started_at,
    }: {
      id: string;
      tournament_bracket: tournamentTable[];
      started?: boolean;
      started_at?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      await $api.patch<ITournamentData>(`/tournaments/${id}`, {
        id,
        tournament_bracket,
        started,
        started_at,
      });
      return { tournament_bracket, started };
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

const tableTournamentSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    cleanTournament: (state) => {
      state._id = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(tableTournamentActionFetch.pending.type, (state) => {
        state.isLoading = true;
      })
      .addCase(
        tableTournamentActionFetch.fulfilled.type,
        (state, { payload }: PayloadAction<ITournamentState>) => {
          const {
            _id,
            tournament_bracket,
            creator,
            name,
            additional,
            code_link,
            date,
            drafts,
            ended_at,
            participants,
            place,
            playtime,
            rules,
            started,
            players,
            classic,
            started_at,
          } = payload;

          state._id = _id;
          state.tournament_bracket = tournament_bracket;
          state.creator = creator;
          state.name = name;
          state.additional = additional;
          state.code_link = code_link;
          state.date = date;
          state.drafts = drafts;
          state.ended_at = ended_at;
          state.participants = participants;
          state.place = place;
          state.playtime = playtime;
          state.rules = rules;
          state.started = started;
          state.players = players;
          state.classic = classic;
          state.started_at = started_at;
          state.isLoading = false;
          state.elo = payload.elo;
        },
      )
      .addCase(
        tableTournamentActionFetch.rejected.type,
        (state, { payload }: PayloadAction<string>) => {
          state.error = true;
          state.isLoading = false;
        },
      )
      // UPDATE
      .addCase(tableTournamentActionUpdate.pending.type, (state) => {
        state.isLoading = true;
      })
      .addCase(
        tableTournamentActionUpdate.fulfilled.type,
        (
          state,
          {payload,}: PayloadAction<{
            tournament_bracket: tournamentTable[];
            started: boolean;
          }>,
        ) => {
          state.tournament_bracket = payload.tournament_bracket;
          state.isLoading = false;
          if (!state.started) {
            state.started = payload.started;
          }
        },
      )
      .addCase(
        tableTournamentActionUpdate.rejected.type,
        (state, { payload }: PayloadAction<string>) => {
          state.error = true;
          state.isLoading = false;
        },
      );
  },
});

export const { cleanTournament } = tableTournamentSlice.actions;
export default tableTournamentSlice.reducer;
