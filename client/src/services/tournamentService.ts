import {groupBy, isEmpty, map, shuffle} from 'lodash'

type tournamentPlayerList = {
  id: string;
  name: string;
  guest: boolean;
  team?: null | 'red' | 'blue';
  win?: boolean;
};

type player = {
  name: string;
  score: number;
  win: boolean;
  disabled?: boolean | undefined;
  finishMatch: boolean;
  team?: 'red' | 'blue' | null | undefined;
  started_at?: string | undefined;
};

export type tournamentTable = {
  name: string;
  score: number;
  win: boolean;
  disabled?: boolean;
  finishMatch: boolean;
  team?: null | 'red' | 'blue';
  started_at?: string;
}[][];

export default new (class TournamentClass {
  tournament_table: tournamentTable[] = [[]]

  getTeamPlayers(round: tournamentTable) {
    const winners: player[] = []
    const classicWinners: player[] = []
    let length = 0
    map(round, (pair) => {
      if (pair[0].win && pair[0].team) {
        winners.push(pair[0])
      }
      if (pair[1].win && pair[1].team) {
        winners.push(pair[1])
      }
      if (pair[0].win || pair[1].win) {
        length++
        if (pair[0].win && pair[0].name !== '(No opponent)') {
          classicWinners.push(pair[0])
        }
        if (pair[1].win && pair[1].name !== '(No opponent)') {
          classicWinners.push(pair[1])
        }
      }
    })

    return {winners, length, classicWinners}
  }

  activeRound(round: tournamentTable) {
    let active = false
    for (let i = 0; i < round.length; i++) {
      if (round[i][0].win || round[i][1].win) {
        active = true
        break
      }
    }

    return active
  }

  init(player_list: tournamentPlayerList[]) {
    this.tournament_table = [[]]
    const teams = groupBy(player_list, 'team')
    const isTeamTouranament =
      Object.keys(teams)[0] !== 'null' && !isEmpty(teams)
    const ceilPlayers = Math.ceil(Math.log2(player_list.length || 8))
    const powPlayers = Math.pow(2, ceilPlayers)

    if (isTeamTouranament) {
      const reds = shuffle(teams['red'])
      const blues = shuffle(teams['blue'])
      for (let i = 0; i < powPlayers / 2; i++) {
        if (!reds[i] && blues[i]) {
          this.tournament_table[0].push([
            {
              name: `${blues[i]?.name || '(No opponent)'}`,
              win: false,
              disabled: false,
              score: 0,
              finishMatch: false,
              team: blues[i]?.team,
            },
            {
              name: `${reds[i]?.name || '(No opponent)'}`,
              win: false,
              disabled: false,
              score: 0,
              finishMatch: false,
              team: reds[i]?.team,
            },
          ])
        } else {
          this.tournament_table[0].push([
            {
              name: `${reds[i]?.name || '(No opponent)'}`,
              win: false,
              disabled: false,
              score: 0,
              finishMatch: false,
              team: reds[i]?.team || null,
            },
            {
              name: `${blues[i]?.name || '(No opponent)'}`,
              win: false,
              disabled: false,
              score: 0,
              finishMatch: false,
              team: blues[i]?.team || null,
            },
          ])
        }
      }
    } else {
      const players = player_list
      for (let i = 0; i < powPlayers / 2; i++) {
        this.tournament_table[0].push([
          {
            name: `${players.pop()?.name || '(No opponent)'}`,
            win: false,
            disabled: false,
            score: 0,
            finishMatch: false,
            team: player_list[i]?.team || null,
          },
          {
            name: `${players.shift()?.name || '(No opponent)'}`,
            win: false,
            disabled: false,
            score: 0,
            finishMatch: false,
            team: player_list[player_list.length - 1]?.team || null,
          },
        ])
      }
    }

    this.tournament_table.forEach((round) => {
      round.forEach((pair) => {
        if (pair[1].name === '(No opponent)') {
          pair[0].win = true
          pair[0].disabled = true
          pair[0].finishMatch = true
        }
      })
    })
    const tournamentBracket = (pair: number) => {
      let pairArray: any[] = []
      if (pair <= 1) {
        return false
      }
      for (let i = 0; i < pair / 2; i++) {
        pairArray.push([
          {
            name: '(TBD)', score: 0, win: false, finishMatch: false
          },
          {
            name: '(TBD)', score: 0, win: false, finishMatch: false
          },
        ])
      }
      this.tournament_table.push(pairArray)
      pairArray = []
      tournamentBracket(pair / 2)
    }
    tournamentBracket(powPlayers / 2)
    this.tournament_table.forEach((round, roundIndex, array) => {
      let ittRound = 0
      if (roundIndex === array.length - 1) {
        ittRound = array.length - 1
      } else {
        ittRound += roundIndex + 1
      }
      let ittPair = 0
      round.forEach((pair, indexPair) => {
        if (indexPair % 2 === 0) {
          ittPair++
        }
        const sortPlayer = indexPair % 2 === 0 ? 0 : 1
        if (pair[0].win) {
          array[ittRound][ittPair - 1][sortPlayer].name = pair[0].name
          array[ittRound][ittPair - 1][sortPlayer].team = pair[0].team

          array[roundIndex][indexPair][0].finishMatch = true
          array[roundIndex][indexPair][1].finishMatch = true
        }
        if (pair[1].win) {
          array[ittRound][ittPair - 1][sortPlayer].name = pair[1].name
          array[ittRound][ittPair - 1][sortPlayer].team = pair[1].team

          array[roundIndex][indexPair][0].finishMatch = true
          array[roundIndex][indexPair][1].finishMatch = true
        }
        if (pair[0].name === '(TBD)' || pair[1].name === '(TBD)') {
          array[ittRound][ittPair - 1][0].disabled = true
          array[ittRound][ittPair - 1][1].disabled = true
        } else {
          array[ittRound][ittPair - 1][0].disabled = false
          array[ittRound][ittPair - 1][1].disabled = false
        }
        pair.forEach((player) => {
          if (player.name === '(TBD)' || player.name === '(No opponent)') {
            player.disabled = true
            player.finishMatch = false
          }
        })
      })
    })

    return this
  }

  updateWin(table: tournamentTable[]) {
    map(table, (round, roundIndex, rounds) => {
      map(round, (pair, pairIndex) => {
        const player1 = pair[0]
        const player2 = pair[1]
        let p1 = 0
        let p2 = 0

        if (player2.name === '(No opponent)') {
          player1.win = true
          player1.finishMatch = false
          player2.finishMatch = false
        } else {
          if (!player1.win && !player2.win) {
            if (player1.score > 2 && player1.score > player2.score) {
              p1++
            }

            if (player2.score > 2 && player2.score > player1.score) {
              p2++
            }

            if (p1 >= 1) {
              player1.win = true
              player2.win = false
              player1.finishMatch = true
              player2.finishMatch = true
            } else if (p2 >= 1) {
              player2.win = true
              player1.win = false
              player2.finishMatch = true
              player1.finishMatch = true
            } else {
              player2.win = false
              player1.win = false
              player2.finishMatch = false
              player1.finishMatch = false
            }
          }
        }
      })

      const prevRound = table[roundIndex - 1]

      if (prevRound && round[0][0].name == '(TBD)') {
        const {classicWinners, winners, length} =
          this.getTeamPlayers(prevRound)

        if (table[0][0][0].team) {
          const teams = groupBy(winners, 'team')

          if (length === prevRound.length) {
            const reds = shuffle(teams['red'])
            const blues = shuffle(teams['blue'])
            for (let i = 0; i < length / 2; i++) {
              const player1 = reds.pop() || blues.pop()
              const player2 = blues.pop() || reds.pop()

              round[i] = [
                {
                  name: `${player1?.name || '(No opponent)'}`,
                  win: (!!player1 && !player2) || (!player1 && !player2),
                  disabled: false,
                  score: 0,
                  finishMatch: false,
                  team: player1?.team || null,
                },
                {
                  name: `${player2?.name || '(No opponent)'}`,
                  win: false,
                  disabled: false,
                  score: 0,
                  finishMatch: false,
                  team: player2?.team || null,
                },
              ]
            }
          }
        } else {
          if (length === prevRound.length) {
            const players = classicWinners
            for (let i = 0; i < length / 2; i++) {
              const player1 = players.pop()
              const player2 = players.shift()
              if (player1 && player2) {
                round[i] = [
                  {
                    name: player1?.name,
                    win: false,
                    disabled: false,
                    score: 0,
                    finishMatch: false,
                    team: null,
                    // team: blues[i]?.team,
                  },
                  {
                    name: player2?.name,
                    win: false,
                    disabled: false,
                    score: 0,
                    finishMatch: false,
                    team: null,
                    // team: blues[i]?.team,
                  },
                ]
              }
              if ((player1 && !player2) || (!player1 && player2)) {
                round[i] = [
                  {
                    name: player1
                      ? player1.name
                      : player2
                        ? player2.name
                        : '(No opponent)',
                    win: true,
                    disabled: true,
                    score: 0,
                    finishMatch: false,
                    // team: blues[i]?.team,
                  },
                  {
                    name: '(No opponent)',
                    win: false,
                    disabled: true,
                    score: 0,
                    finishMatch: false,
                  },
                ]
              }
            }
          }
        }
      }
    })

    return table
  }

  returnTable() {
    return this.tournament_table
  }
})()
