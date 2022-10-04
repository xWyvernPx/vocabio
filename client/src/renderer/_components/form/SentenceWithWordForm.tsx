import React from 'react';
import styled from 'styled-components';
import { PrimaryButton } from '../common/button/PrimaryButton';
import { TextField } from './field/TextField';

type Props = {};
const FormLayout = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
const SentenceWithWordForm = (props: Props) => {
  return (
    <FormLayout>
      <TextField>
        <input type="text" placeholder=" " />
        <label>Sentence with </label>
      </TextField>
      <PrimaryButton>Confirm</PrimaryButton>
    </FormLayout>
  );
};

export default SentenceWithWordForm;
