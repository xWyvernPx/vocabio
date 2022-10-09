import { gql } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { modalPayloadSelector } from 'renderer/redux/slice/modalSlice';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
type Props = {};

const GET_WORD_DETAIL_QUERY = gql`
  query ($word: String) {
    getDetailWord(word: $word) {
      word
      phonetic
      phonetics {
        text
        audio
      }
      origin
      meanings {
        partOfSpeech
        definitions {
          definition
          example
        }
      }
    }
  }
`;

const WordDetailModal = (props: Props) => {
  const { word } = useSelector(modalPayloadSelector);
  const [wordInformation, setWordInformation] = useState();
  const { data } = useQuery(GET_WORD_DETAIL_QUERY, {
    fetchPolicy: 'no-cache',
    variables: { word },
  });

  useEffect(() => {
    if (data?.getDetailWord) setWordInformation(data?.getDetailWord);
  }, [data]);

  return <ModalWrapper>ok</ModalWrapper>;
};
const ModalWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 5rem 0;
`;
export default WordDetailModal;
