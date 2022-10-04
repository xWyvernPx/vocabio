import React from 'react';
import styled from 'styled-components';
import { PrimaryButton } from '../common/button/PrimaryButton';
import { TextField } from './field/TextField';

type Props = {
  changeFormHandle: Function;
};
const SignUpFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;
const FormTitle = styled.h1`
  color: var(--dark-color);
  font-size: 2.5rem;
`;

const Span = styled.span``;
const SignUpForm = ({ changeFormHandle }: Props) => {
  return (
    <SignUpFormWrapper>
      <FormTitle>Sign up new account</FormTitle>
      <TextField>
        <input type="text" placeholder=" " />
        <label htmlFor="">Username</label>
      </TextField>
      <TextField>
        <input type="password" placeholder=" " />
        <label htmlFor="">Password</label>
      </TextField>
      <TextField>
        <input type="password" placeholder=" " />
        <label htmlFor="">Confirm Password</label>
      </TextField>
      <PrimaryButton type="submit">Sign up</PrimaryButton>
      <Span>or</Span>
      <Span>
        Already have an account ?{' '}
        <Span
          style={{
            color: 'var(--secondary-color',
            cursor: 'pointer',
          }}
          onClick={() => changeFormHandle()}
        >
          Sign in{' '}
        </Span>
      </Span>
    </SignUpFormWrapper>
  );
};

export default SignUpForm;
