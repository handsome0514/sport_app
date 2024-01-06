import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { actionUserLogout } from '../../redux/reducer/userReducer';
import {
  BurgerMenu,
  BurgerMenuIcon,
  BurgerTitle,
  BurgerWrapper,
} from './Burger.styled';

export const Burger = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { user_id } = useAppSelector(({ user }) => user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const buttonLogoutHandlerClick = () => {
    dispatch(actionUserLogout()).then(() => navigate(-1));
  };
  const handleCloseMenuPress = useCallback(() => {
    setOpenMenu(false);
  }, []);
  useEffect(() => {
    window.document.addEventListener('click', handleCloseMenuPress);
    return () => {
      window.document.removeEventListener('click', handleCloseMenuPress);
    };
  }, [handleCloseMenuPress]);

  if (!user_id) {
    return (
      <BurgerWrapper onClick={(e) => e.stopPropagation()}>
        <NavLink style={{ fontSize: 30 }} to="/login">
          Login
        </NavLink>
      </BurgerWrapper>
    );
  }
  return (
    <BurgerWrapper onClick={(e) => e.stopPropagation()}>
      <BurgerTitle>Menu</BurgerTitle>
      <BurgerMenuIcon
        onClick={() => setOpenMenu((prev) => !prev)}
        open={openMenu}
      ></BurgerMenuIcon>
      <BurgerMenu className={`${openMenu ? 'active' : ''}`}>
        <li onClick={() => setOpenMenu(false)}>
          <NavLink to={`/player-card/${user_id}`}>Player Card</NavLink>
        </li>
        <li onClick={() => setOpenMenu(false)}>
          <NavLink to="/create">Create tournament</NavLink>
        </li>
        <li onClick={() => setOpenMenu(false)}>
          <NavLink to="/tournament">List of Tournaments</NavLink>
        </li>
        <li onClick={() => setOpenMenu(false)}>
          <NavLink to="/profile">Profile</NavLink>
        </li>
        <li onClick={buttonLogoutHandlerClick}>Logout</li>
      </BurgerMenu>
    </BurgerWrapper>
  );
};
