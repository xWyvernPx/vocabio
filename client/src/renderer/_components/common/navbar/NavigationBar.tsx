import React, { useEffect } from 'react';
import styled from 'styled-components';
import { TbHome } from 'react-icons/tb';
import { IoCompassOutline } from 'react-icons/io5';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

type Props = {};
const NavigationBarWrapper = styled.ul`
  display: flex;
  justify-content: center;
  gap: 4rem;
  background-color: var(--white-color);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 2rem 5rem;
  border-radius: 50% 50% 0 0;
`;
const NavItem = styled.li`
  cursor: pointer;
  width: 7rem;
  svg {
    width: 3rem;
    height: 3rem;
    transition: all 0.15s linear;
  }
  &:hover svg {
    filter: invert(49%) sepia(36%) saturate(1708%) hue-rotate(302deg)
      brightness(92%) contrast(88%);
  }
  svg.active {
    filter: invert(49%) sepia(36%) saturate(1708%) hue-rotate(302deg)
      brightness(92%) contrast(88%);
  }
`;
const NavigationBar = (props: Props) => {
  const nav = useNavigate();
  const { pathname } = useLocation();

  return (
    <NavigationBarWrapper>
      <NavItem onClick={() => nav('/')}>
        <TbHome className={`${pathname == '/' ? 'active' : ''}`} />
      </NavItem>
      <NavItem onClick={() => nav('/explore')}>
        <IoCompassOutline
          className={`${pathname.includes('explore') ? 'active' : ''}`}
        />
      </NavItem>
      <NavItem
        onClick={() => {
          nav('/account');
        }}
      >
        <HiOutlineUserCircle
          className={`${pathname.includes('account') ? 'active' : ''}`}
        />
      </NavItem>
    </NavigationBarWrapper>
  );
};

export default NavigationBar;
