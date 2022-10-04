import React, { useState } from 'react';
import LoginForm from 'renderer/_components/form/LoginForm';
import SignUpForm from 'renderer/_components/form/SignUpForm';

// type Props = {};
import styled from 'styled-components';

const LoginScreen = () => {
  const [hasAccount, setHasAccount] = useState<boolean>(true);
  return (
    <LoginScreenWrapper>
      {hasAccount ? (
        <LoginForm changeFormHandle={() => setHasAccount(false)} />
      ) : (
        <SignUpForm changeFormHandle={() => setHasAccount(true)} />
      )}
    </LoginScreenWrapper>
  );
};

const LoginScreenWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--white-color);
`;

export default LoginScreen;
