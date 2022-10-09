import styled from 'styled-components';
interface ButtonProps {
  width?: String;
}
export const PrimaryButton = styled.button`
  background: linear-gradient(
    200.96deg,
    #fedc2a -29.09%,
    #dd5789 51.77%,
    #7a2c9e 129.35%
  );
  color: var(--white-color);
  border: none;
  padding: 1.5rem 2.5rem;
  font-size: 1.7rem;
  line-height: 1.5rem;
  font-weight: 600;
  /* transition: all 0.2s linear; */
  width: ${(props: ButtonProps) =>
    props.width ? props.width.toString() : 'auto'};
`;

export const PrimaryOutlineButton = styled.button`
  background-color: var(--white-color);
  color: var(--primary-color);
  /* border-image: linear-gradient(
      200.96deg,
      #fedc2a -29.09%,
      #dd5789 51.77%,
      #7a2c9e 129.35%
    )
    30;
  border-style: solid;
  border-width: 3px; */
  padding: 2rem 3rem;
  font-size: 1.7rem;
  line-height: 2.6rem;
  width: ${(props: ButtonProps) =>
    props.width ? props.width.toString() : 'auto'};
`;

export const SuccessButton = styled.button`
  background-color: var(--success);
  color: var(--white-color);

  padding: 2rem 3rem;
  font-size: 1.7rem;
  line-height: 2.6rem;
  width: ${(props: ButtonProps) =>
    props.width ? props.width.toString() : 'auto'};
`;
export const WarningButton = styled.button`
  background-color: var(--warning);
  color: var(--white-color);

  padding: 2rem 3rem;
  font-size: 1.7rem;
  line-height: 2.6rem;
  width: ${(props: ButtonProps) =>
    props.width ? props.width.toString() : 'auto'};
`;
export const DangerButton = styled.button`
  background-color: var(--danger);
  color: var(--white-color);

  padding: 2rem 3rem;
  font-size: 1.7rem;
  line-height: 2.6rem;
  width: ${(props: ButtonProps) =>
    props.width ? props.width.toString() : 'auto'};
`;
