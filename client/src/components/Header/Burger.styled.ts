import styled from 'styled-components'

type BurgerMenuType = {
  open: boolean;
};

export const BurgerWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const BurgerTitle = styled.span`
  font-size: 25.5px;
  line-height: 26px;
  text-transform: uppercase;
  margin-right: 20px;
`
export const BurgerMenuIcon = styled.div<BurgerMenuType>`
  width: 27px;
  height: 4px;
  background-color: ${({ open }) => (open ? 'transparent' : 'white')};
  position: relative;
  transition: all 0.1s ease-in-out;
  &::before {
    content: '';
    position: absolute;
    width: 27px;
    height: 4px;
    background-color: white;
    bottom: ${({ open }) => (open ? '0px' : '-8px')};
    transform: rotate(${({ open }) => (open ? '45deg' : '0')});
    transition: all 0.2s ease-in-out;
  }
  &::after {
    content: '';
    position: absolute;
    width: 27px;
    height: 4px;
    background-color: white;
    top: ${({ open }) => (open ? '0px' : '-8px')};
    transform: rotate(${({ open }) => (open ? '-45deg' : '0')});
    transition: all 0.2s ease-in-out;
  }
`
export const BurgerMenu = styled.ul`
  visibility: hidden;
  position: absolute;
  bottom: -149px;
  right: 0;
  width: 200px;
  height: 250px;
  background: #d20028;
  box-shadow: -7px 9px 12px rgba(0, 0, 0, 0.25);
  border-radius: 10px 0px 0px 10px;
  list-style: none;
  padding: 13px 20px;
  overflow: hidden;
  opacity: 0;
  transition: all 0.2s ease-in-out;
  z-index: 1000;
  li {
    text-align: center;
    font-size: 24px;
    line-height: 24px;
    letter-spacing: 0.05em;
    margin-bottom: 24px;
    &:last-child {
      margin-bottom: 0;
    }
    a {
      &.active {
        color: #ffbc11;
      }
    }
  }
  &.active {
    visibility: visible;
    opacity: 1;
  }
`
