import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { DangerButton, SuccessButton } from '../button/PrimaryButton';
import { closeConfirmModal } from 'renderer/redux/slice/confirmModalSlice';

type Props = {
  confirmButton: {
    label: String;
    action: Function;
  };
};
const ModalWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30rem;
  height: fit-content;
  border-radius: 5px;
  font-size: 1.5rem;
  background-color: var(--white-color);
  padding: 1.5rem 2rem;

  box-sizing: border-box;
  box-shadow: 1px 1px 10px -3px var(--gray);
`;
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: transparent;
  z-index: 200;
`;
const Header = styled.h2`
  width: 100%;
  text-align: center;
  margin: 0.5rem 0; ;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
`;
const Content = styled.span`
  font-size: 1.65rem;
  width: 100%;
  text-align: center;
  display: block;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
`;
const ConfirmModal = ({ confirmButton: { action, label } }: Props) => {
  const dispatch = useDispatch();
  const content = useSelector((state: any) => state.confirmModal.content);
  return (
    <ModalBackdrop>
      <ModalWrapper>
        <Header> Are you sure ?</Header>
        <Content>{content || 'Mark this word as already known'}</Content>
        <ButtonsWrapper>
          <SuccessButton
            style={{ padding: '5px 15px' }}
            onClick={() => action()}
          >
            {label}
          </SuccessButton>
          <DangerButton
            style={{ padding: '5px 15px', marginLeft: '10px' }}
            onClick={() => dispatch(closeConfirmModal())}
          >
            Cancel
          </DangerButton>
        </ButtonsWrapper>
      </ModalWrapper>
    </ModalBackdrop>
  );
};

export default ConfirmModal;
