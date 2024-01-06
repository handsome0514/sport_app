import React, {FC} from 'react';
import styled from 'styled-components';

import starSvg from '../../assets/svg/star.svg';
import winSvg from '../../assets/svg/win.svg';

const LineTop = styled.div<InnerProps>`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  width: ${({marginRightRound}) => marginRightRound / 2}px;
  height: ${({lineHeight}) => lineHeight}px;
  background-color: ${({color}) => color};
  right: -${({marginRightRound}) => marginRightRound / 2}px;
  top: -${({margin, lineHeight}) => margin / 2 + lineHeight / 2}px;

  &::before {
    content: '';
    display: block;
    height: ${({marginPair, height, margin}) =>
      marginPair / 2 + height + margin}px;
    transform: translateY(-${({marginPair, height, margin}) => marginPair / 2 + height + margin}px);
    width: ${({lineHeight}) => lineHeight}px;
    background-color: ${({color}) => color};
  }
`;

const LineBottom = styled.div<InnerProps>`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  width: ${({marginRightRound}) => marginRightRound / 2}px;
  height: ${({lineHeight}) => lineHeight}px;
  background-color: ${({color}) => color};
  right: -${({marginRightRound}) => marginRightRound / 2}px;
  top: ${({height, lineHeight, margin}) =>
    height + margin / 2 - lineHeight / 2}px;

  &::before {
    content: '';
    display: block;
    height: ${({marginPair, height, margin}) =>
      marginPair! / 2 + height + margin}px;
    width: ${({lineHeight}) => lineHeight}px;
    background-color: ${({color}) => color};
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    top: ${({marginPair, height, margin}) =>
      height + margin + marginPair / 2}px;
    right: -${({marginRightRound}) => marginRightRound / 2}px;
    width: ${({marginRightRound}) => marginRightRound / 2}px;
    height: ${({lineHeight}) => lineHeight}px;
    background-color: ${({color}) => color};
  }
`;

const Inner = styled.div<InnerProps>`
  width: ${({width}) => width}px;
  height: ${({height}) => height}px;

  display: flex;
  position: relative;
  margin-bottom: ${({margin}) => margin}px;

  .value {
    position: relative;
    border: none;
    font-weight: 700;
    font-size: 17px;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    &::disabled {
      background-color: white;
    }
  }

  z-index: 1;
`;

const InputBox = styled.div<InnerProps>`
  display: flex;
  width: ${({width}) => width}px;;
`;
const DivScore = styled.div<{
  finishWin: boolean;
  team?: null | 'red' | 'blue';
}>`
  width: 65%;
  overflow: hidden;
  display: flex;
  background: ${({color, finishWin, team}) =>
    finishWin && !team
      ? 'linear-gradient(97.46deg, #429ABE -57.08%, rgba(66, 154, 190, 0) 57.19%), #002A3C;'
      : team
        ? team === 'blue'
          ? '#0178C8'
          : '#D20028'
        : color};
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  display: flex;
  align-items: center;

  > div {
    display: flex;
    align-items: center;
    flex: 1;

    &::after {
      content: '';
      display: block;
      width: 2px;
      height: 16px;
      background-color: rgba(255, 255, 255, 0.4);
      border-radius: 10px;
    }

    &:last-child {
      &::after {
        display: none;
      }
    }
  }
`;
const DivName = styled.div<DivNameProps>`
  width: 90%;
  overflow: hidden;
  background: white;
  display: flex;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  display: flex;
  align-items: center;
  position: relative;
  background: ${({finishWin, win}) =>
    finishWin ? '#FFBC11' : win ? '#EDEDE8' : 'white'};
  ${({hoverScroll, finishWin, win}) =>
    hoverScroll &&
    `
    input[type="text"] {
        &:hover{
    animation: scrolling 8s .2s linear 1;;
}
        @keyframes scrolling {
    from { top: 0; transform: translate3d(0, 0, 0); }
    to { transform: translate3d(-100%, 0, 0); }
  }
    }
    &::before {
    content: '';
    position: absolute;
    display: block;
    width: 18%;
    height: 100%;
    right: 0;
    z-index: 1000;
}
`}
  ${({win, finishWin}) =>
    win &&
    `

input[type="text"] {
    background: ${
      finishWin
        ? 'linear-gradient(102.2deg, #FFBC11 -8.27%, rgba(255, 188, 17, 0) 83.13%), #CC2B24;'
        : '#EDEDE8'
    };
}
&::after{
    content: '';
    display: block;
    position: absolute;
    width: 15px;
    height: 15px;
    background-image: url(${finishWin ? winSvg : starSvg});
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    right: 10px;
    z-index: 1000;
}
`}
`;

const InputName = styled.input`
  width: 400px;
  padding: 15px;

  &::placeholder {
    color: black;
  }

  &:disabled {
    color: black;
  }
`;

const InputScore = styled.div`
  width: 100%;
  background: transparent;
  color: white;
  text-align: center;
  position: relative;
  cursor: pointer;
`;

type PlayerProps = {
  name: string;
  score: number;
  width: number;
  height: number;
  margin: number;
  lineBottom?: boolean | null;
  lineTop?: boolean | null;
  marginPair: number;
  marginRightRound: number;
  lineHeight?: number;
  color?: string;
  win?: boolean;
  finishWin: boolean;
  onChangeScore?: any;
  onChangeName?: any;
  onKeyUp?: any;
  round: number;
  pair: number;
  player: number;
  disabled?: boolean;
  disabledInput?: boolean;
  lastRound: boolean;
  team?: null | 'red' | 'blue';
};
type InnerProps = {
  width?: number;
  height: number;
  margin: number;
  marginPair: number;
  marginRightRound: number;
  lineHeight: number;
  color?: string;
  win?: boolean;
  team?: null | 'red' | 'blue';
};
type DivNameProps = {
  win?: boolean;
  finishWin?: boolean;
  hoverScroll: boolean;
};

export const Player: FC<PlayerProps> = ({
                                          lastRound,
                                          disabledInput,
                                          finishWin,
                                          disabled,
                                          onKeyUp,
                                          round,
                                          pair,
                                          player,
                                          onChangeScore,
                                          onChangeName,
                                          win,
                                          lineHeight = 5,
                                          color,
                                          name,
                                          score,
                                          width,
                                          height,
                                          margin,
                                          marginRightRound,
                                          lineBottom,
                                          lineTop,
                                          marginPair,
                                          team,
                                        }) => {

  return (
    <>
      <Inner
        marginRightRound={marginRightRound}
        marginPair={marginPair}
        height={height}
        width={width}
        margin={margin}
        lineHeight={lineHeight}
        color={color}
        team={team}
      >
        <InputBox
          marginRightRound={marginRightRound}
          marginPair={marginPair}
          height={height}
          width={width}
          margin={margin}
          lineHeight={lineHeight}
          color={color}
          onKeyUp={onKeyUp}
        >
          <DivName
            hoverScroll={
              name.length > 12 && name !== '(No opponent)' ? true : false
            }
            finishWin={finishWin}
            win={win}
          >
            <InputName
              disabled={true}
              type="text"
              value={name.toLocaleUpperCase()}
            />
          </DivName>

          <DivScore team={team} finishWin={lastRound} color={color}>
            <div>
              <InputScore
                className="value"
                onClick={() => {
                  console.log('asdfasdf');
                  if (!disabled) {
                    onChangeScore(score);
                  }
                }}
              >
                {disabledInput ? '-' : score}
              </InputScore>
            </div>
          </DivScore>
        </InputBox>

        {lineBottom && (
          <LineBottom
            marginRightRound={marginRightRound}
            marginPair={marginPair}
            height={height}
            width={width}
            margin={margin}
            lineHeight={lineHeight}
            color={color}
          />
        )}
        {lineTop && (
          <LineTop
            marginRightRound={marginRightRound}
            marginPair={marginPair}
            height={height}
            width={width}
            margin={margin}
            lineHeight={lineHeight}
            color={color}
          />
        )}
      </Inner>
    </>
  );
};
