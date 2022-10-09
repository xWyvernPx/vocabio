import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { gql, useQuery, useApolloClient } from '@apollo/client';
type Props = {};
const Screen = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const AvatarWrapper = styled.div`
  width: 15rem;
  border-radius: 50%;
  aspect-ratio: 1;
  background-color: white;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;
const InformationArea = styled.div`
  width: 70%;
  background-color: white;
  margin: 2rem 0;
  padding: 1.5rem 2.5rem;
  border-radius: var(--radius);
  display: flex;
  /* align-items: center; */
  justify-content: center;
  flex-direction: column;
`;
const InformationHeader = styled.h1`
  width: 100%;
  text-align: center;
  font-size: 2.5rem;
`;
const InformationField = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
`;
const UsernameHeader = styled.h1`
  color: var(--white-color);
  font-weight: 600;
  font-size: 2.5;
`;
const InformationProps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  span:first-child {
    font-weight: 600;
    font-size: 1.75rem;
  }
  span:nth-child(2) {
    font-weight: 500;
    font-size: 1.45rem;
  }
`;
const GET_LEARNING_WORDS_QUERY = gql`
  query {
    allLearningWords {
      word
      reviewLevel
      nextReview
    }
  }
`;
const GET_KNOWN_WORDS_QUERY = gql`
  query {
    getKnownWords
  }
`;
const AccountScreen = (props: Props) => {
  const { query } = useApolloClient();
  const [learningWords, setlearningWords] = useState<any>();
  const [knownWords, setKnownWords] = useState<any>();

  useEffect(() => {
    (() =>
      query({
        query: GET_LEARNING_WORDS_QUERY,
        fetchPolicy: 'no-cache',
      })
        .then((result) => result.data.allLearningWords)
        .then((result) => setlearningWords(result)))();
    (() =>
      query({
        query: GET_KNOWN_WORDS_QUERY,
        fetchPolicy: 'no-cache',
      })
        .then((result) => result.data.getKnownWords)
        .then((result) => setKnownWords(result)))();
  }, []);

  return (
    <Screen>
      <AvatarWrapper>
        <img src="https://source.unsplash.com/random" alt="" />
      </AvatarWrapper>
      <UsernameHeader>WyvernP</UsernameHeader>
      <InformationArea>
        <InformationHeader>Profile</InformationHeader>
        <InformationField>
          <InformationProps>
            <span>Learning words</span>
            <span>{learningWords?.length}</span>
          </InformationProps>
          <InformationProps>
            <span>Known words</span>
            <span>{knownWords?.length}</span>
          </InformationProps>
        </InformationField>
      </InformationArea>
    </Screen>
  );
};

export default AccountScreen;
