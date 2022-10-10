import { gql } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { modalPayloadSelector } from 'renderer/redux/slice/modalSlice';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import axios, { Axios } from 'axios';
('axios');
type Props = {};

// const oxfordAxios = axios({
//   baseURL: 'https://od-api.oxforddictionaries.com/api/v2',
//   headers: {
//     app_id: 'a696eaf4',
//     app_key: '76e4389d54d6522a318cc7fbfafd1a4e',
//     'Access-Control-Allow-Origin': '*',
//   },

//   withCredentials: true,
// });
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
  const [wordInformation, setWordInformation] = useState<any>();
  const { data } = useQuery(GET_WORD_DETAIL_QUERY, {
    fetchPolicy: 'no-cache',
    variables: { word },
  });

  useEffect(() => {
    if (data?.getDetailWord) setWordInformation(data?.getDetailWord);
  }, [data]);
  useEffect(() => {
    console.log(wordInformation);
  }, [wordInformation]);
  return (
    <ModalWrapper>
      <span
        style={{
          fontSize: '3rem',
          fontWeight: '600',
          color: 'var(--secondary-color)',
          marginBottom: '1.5rem',
          display: 'block',
        }}
      >
        {wordInformation?.word}
        {'  '}
        <span style={{ fontSize: '1.75rem', color: 'var(--primary-color)' }}>
          {wordInformation?.meanings[0]?.partOfSpeech || ''}
        </span>
      </span>
      <div
        style={{
          marginBottom: '1.5rem',
        }}
      >
        <span style={{ fontSize: '1.85rem', fontWeight: '500' }}>
          {wordInformation?.phonetic}
        </span>
      </div>
      <span style={{ fontSize: '2rem', fontWeight: '600' }}>Meanings</span>
      {wordInformation?.meanings?.map((meaning: any, index: number) => (
        <ul style={{ listStyle: 'initial', fontSize: '1.5rem' }}>
          <span
            style={{
              fontSize: '2rem',
              fontWeight: 600,
              marginTop: '1.25rem',
              marginBottom: '.75rem',
              display: 'block',
            }}
          >
            {index + 1}. Type : {meaning?.partOfSpeech}
          </span>
          {meaning?.definitions?.map((definition: any) => {
            return (
              <li style={{ margin: '.5rem 0', listStyle: 'inside' }}>
                {definition?.definition}
              </li>
            );
          })}
        </ul>
      ))}
    </ModalWrapper>
  );
};
const ModalWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 5rem 0;
`;
export default WordDetailModal;
