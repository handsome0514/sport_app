import { tournamentTable } from './services/tournamentService'

export interface ITournaments {
  _id: string | null;
  tournament_bracket: tournamentTable[];
  creator: string | null;
  name: string | null;
  date: string | null;
  place: string | null;
  additional: string | null;
  participants: number | null;
  rules: string | null;
  playtime: string | null;
  drafts: boolean | null;
  code_link: string | null;
  ended_at: string | null;
  started: boolean | null;
  isLoading?: boolean;
  players: any[] | null;
  error?: boolean | null;
  classic: boolean | null;
  started_at: string | null;
  elo: boolean;
}
export interface ITournamentData {
  total: number;
  tournaments: ITournaments[];
}

export interface ITournamentBracket {
  pair: {
    name: string;
    score: [number, number, number];
    win: boolean;
    disabledInput?: boolean;
  }[][];
  complete: boolean;
}
[]

export interface Players {
  id: string;
  name: string;
  email: string;
}
