import React from 'react';

import styled from 'styled-components';
import { PrimaryButton } from '../common/button/PrimaryButton';
import { TextField } from './field/TextField';
import { useForm } from 'react-hook-form';
import useAuth from 'renderer/_hooks/useAuth';
const LoginFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;
const FormTitle = styled.h1`
  color: var(--dark-color);
`;
const Span = styled.span``;
const LoginForm = ({ changeFormHandle }: { changeFormHandle: Function }) => {
  const { handleSubmit, register } = useForm();
  const { login } = useAuth();
  return (
    <LoginFormWrapper
      onSubmit={handleSubmit((value) => {
        login(value.username, value.password);
      })}
    >
      <FormTitle>Welcome, login to continue</FormTitle>
      <TextField>
        <input {...register('username')} type="text" placeholder=" " />
        <label htmlFor="">Username</label>
      </TextField>
      <TextField>
        <input {...register('password')} type="password" placeholder=" " />
        <label htmlFor="">Password</label>
      </TextField>
      <PrimaryButton type="submit">Login</PrimaryButton>
      <Span>or</Span>
      <Span>
        Don't have account ?{' '}
        <Span
          style={{
            color: 'var(--secondary-color',
            cursor: 'pointer',
          }}
          onClick={() => changeFormHandle()}
        >
          Sign up{' '}
        </Span>
      </Span>
    </LoginFormWrapper>
  );
};

export default LoginForm;
