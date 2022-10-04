import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { TbX } from 'react-icons/tb';
import { useSelector, useDispatch } from 'react-redux';
import {
  closeModal,
  modalStateSelector,
} from 'renderer/redux/slice/modalSlice';
type Props = {};
const ModalWrapper = styled.div`
  position: fixed;
  left: 5rem;
  right: 5rem;
  top: 10%;
  bottom: 10%;
  background-color: var(--white-color);
  box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 0.5);
  border-radius: var(--radius);
  z-index: 50;
`;
const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 1rem;
  background-color: transparent;
  box-shadow: none;
  width: fit-content;
  svg {
    width: 2rem;
    height: 2rem;
  }
`;
const ModalContent = styled.div`
  height: 100%;
  padding: 0.5rem 5rem;
`;
const Modal = (props: PropsWithChildren) => {
  const modalState = useSelector(modalStateSelector);
  const dispatch = useDispatch();
  return (
    <ModalWrapper>
      <CloseButton onClick={() => dispatch(closeModal())}>
        <TbX />
      </CloseButton>
      <ModalContent>{props?.children}</ModalContent>
    </ModalWrapper>
  );
};

export default Modal;
