import React from 'react';
import { useSelector } from 'react-redux';
import { modalPayloadSelector } from 'renderer/redux/slice/modalSlice';
import styled from 'styled-components';
import { PrimaryButton } from '../common/button/PrimaryButton';
import { TextField } from './field/TextField';
import { useForm } from 'react-hook-form';
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
  const { reviewDoneHandler, reviewFailureHandler } =
    useSelector(modalPayloadSelector);
  const { handleSubmit } = useForm();
  return (
    <FormLayout
      onSubmit={handleSubmit(() => {
        reviewDoneHandler?.();
      })}
    >
      <TextField>
        <input type="text" placeholder=" " />
        <label>Sentence with </label>
      </TextField>
      <PrimaryButton>Confirm</PrimaryButton>
    </FormLayout>
  );
};

export default SentenceWithWordForm;
