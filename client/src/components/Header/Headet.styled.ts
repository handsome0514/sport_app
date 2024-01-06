import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import headerDesktop from '../../assets/img/header_desktop.png';
import headerMobile from '../../assets/img/header_mobile.png';

interface HeaderDropDownProps {
  readonly opened: boolean;
}

export const HeaderDiv = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  color: #ffffff;
  position: relative;
  z-index: 1000;
  background: url(${headerDesktop});
  background-repeat: no-repeat;
  background-position: 0 0px;
  background-size: 100% 100%;
  height: 124px;
  padding: 17px 40px;
  @media only screen and (max-width: 768px) {
    background: url(${headerMobile});
    background-repeat: no-repeat;
    background-position: 0 0px;
    background-size: 100% 100%;
    height: 124px;
    padding: 21px 27px;
    margin-bottom: 40px;
  }
`;
export const Logo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  span {
    font-family: 'SubsoccerFont';
    font-size: 24px;
    line-height: 29px;
    text-transform: uppercase;
  }
  @media only screen and (max-width: 768px) {
    span {
      font-size: 20px;
      line-height: 24px;
    }
  }
`;

export const HeaderNav = styled.nav`
  padding-top: 1rem;
  display: flex;
  align-items: center;
  font-size: 25.5px;
  line-height: 26px;
  text-align: center;
  letter-spacing: 0.006em;
  text-transform: uppercase;
  > div {
    cursor: pointer;
  }
`;
export const HeaderNavLink = styled(NavLink)`
  margin: 0 40px;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  &::before{
      content: '';
      opacity: 0;
      position: absolute;
      display: block;
      width: 8px;
      height: 8px;
      background-color: red;
      border-radius: 50%;
      margin-top: 30px;
      transition: all .2s ease-in-out;
    }
  &:hover{
    transition: all .2s ease-in-out;
    &::before{
      opacity: 1;
    }
  }
  &.active {
    &::before{
      opacity: 1;
    }
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    &::before {
      margin-top: 45px;
    }
  }
div {
  cursor: pointer;
}
`;

export const NavLinkDrop = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  &::before {
    content: '';
    opacity: 0;
    position: absolute;
    display: block;
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
    margin-top: 30px;
    transition: all 0.2s ease-in-out;
  }
  &:hover {
    transition: all 0.2s ease-in-out;
    &::before {
      opacity: 1;
    }
  }
  &.active {
    &::before {
      opacity: 1;
    }
  }
`;

export const HeaderDropDown = styled.div`
  position: absolute;
  display: none;
  left: 0;
  right: 0;
  margin-top: 45px;
  z-index: 1000;
  @media (min-width: 768px) and (max-width: 1024px) {
    margin-top: 65px;
  }
  &.active {
    display: block;
  }
`;
export const List = styled.ul`
  display: flex;
  flex-direction: column;
  background: #d20028;
  box-shadow: -7px 9px 12px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  list-style: none;
  gap: 5px;
  align-items: center;
  padding: 20px 15px;
  li {
    font-size: 24px;
    line-height: 24px;
    letter-spacing: 0.05em;
    text-align: left;
    &.active {
      color: #ffbc11;
    }
  }
`;
