import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from 'renderer/redux/slice/modalSlice';
import {
  PrimaryOutlineButton,
  SuccessButton,
  WarningButton,
} from 'renderer/_components/common/button/PrimaryButton';
import VocabCard from 'renderer/_components/common/card/VocabCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import styled from 'styled-components';
import { gql, useApolloClient } from '@apollo/client';
import Loading from 'renderer/_components/common/loading/Loading';
import { confirmAlert } from 'react-confirm-alert';
import {
  closeConfirmModal,
  openConfirmModal,
} from 'renderer/redux/slice/confirmModalSlice';
type Props = {};
const SUGGEST_NEW_WORDS_QUERY = gql`
  query {
    suggestLearningWords {
      name
      desc
      phonetics {
        text
        audio
      }
    }
  }
`;
const ADD_WORD_KNOWN_MUTATION = gql`
  mutation ($word: String) {
    addWordKnownList(word: $word)
  }
`;
const ExploreScreen = (props: Props) => {
  const [swiperRef, setSwiperRef] = useState<any>();
  const dispatch = useDispatch();
  const client = useApolloClient();
  const [newWords, setNewWords] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState<number | any>(0);

  useEffect(() => {
    client
      .query({ query: SUGGEST_NEW_WORDS_QUERY, fetchPolicy: 'no-cache' })
      .then((result) => {
        if (result.loading === false) {
          setNewWords([...newWords, ...result.data.suggestLearningWords]);
          setIsLoading(false);
        }
      });
  }, []);
  useEffect(() => {
    console.log(newWords);
  }, [newWords]);
  useEffect(() => {
    if (swiperRef)
      window.addEventListener('keydown', (e: KeyboardEvent) => {
        switch (e.code) {
          case 'ArrowRight':
            swiperRef.slideNext();
            break;
          case 'ArrowLeft':
            swiperRef.slidePrev();
            break;
          case 'ArrowUp':
            break;
          case 'ArrowDown':
            break;
        }
      });
    return () => {
      window.removeEventListener('keydown', () => {});
    };
  }, [swiperRef]);
  const alreadyKnownClickHandler = useCallback(() => {
    console.log(currentSlide);
    const currentWord = swiperRef.slides[currentSlide].getAttribute('vocab');
    console.log(currentWord);
    dispatch(
      openConfirmModal({
        content: 'Mark this word as known',
        confirmAction: async () => {
          const result = await client
            .mutate({
              mutation: gql`
                mutation ($word: String) {
                  addWordKnownList(word: $word)
                }
              `,
              variables: { word: currentWord },
            })
            .then((result) => result.data.addWordKnownList);
          if (result) {
            setNewWords(
              newWords.filter((word: any) => word.name != currentWord)
            );
            dispatch(closeConfirmModal());
          }
        },
      })
    );
  }, [swiperRef, currentSlide]);
  return (
    <Screen>
      <WelcomeSpan>Exploring new words to learn</WelcomeSpan>

      <CardSlider>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          // autoHeight={true}
          onSlideChange={(e) => setCurrentSlide(e.activeIndex)}
          onSwiper={(swiper) => setSwiperRef(swiper)}
          effect={'cards'}
        >
          {newWords?.map((word: any) => (
            <SwiperSlide vocab={word?.name}>
              <VocabCard word={word} key={word.name} />
            </SwiperSlide>
          ))}
          <SwiperSlide>
            <BlankCardWrapper>
              <button
                onClick={() => {
                  setIsLoading(true);
                  client
                    .query({
                      query: SUGGEST_NEW_WORDS_QUERY,
                      fetchPolicy: 'no-cache',
                    })
                    .then((result) => {
                      if (result.loading === false) {
                        setNewWords([
                          ...newWords,
                          ...result.data.suggestLearningWords,
                        ]);
                        setIsLoading(false);
                      }
                    });
                }}
              >
                more
              </button>
            </BlankCardWrapper>
          </SwiperSlide>
        </Swiper>
      </CardSlider>
      <ActionButtons>
        <PrimaryOutlineButton
          onClick={() =>
            dispatch(
              openModal({
                componentName: 'WORD_DETAIL',
                payload: 'stuck',
              })
            )
          }
        >
          Learn more
        </PrimaryOutlineButton>
        <SuccessButton onClick={() => alreadyKnownClickHandler()}>
          Already known
        </SuccessButton>
      </ActionButtons>
      {isLoading && <Loading />}
    </Screen>
  );
};
const BlankCardWrapper = styled.div`
  background: transparent;
  width: 100%;
  height: 30rem;
  display: grid;
  place-items: center;
`;
const Screen = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const CardSlider = styled.div`
  width: 100%;
  .swiper {
    width: 100%;
  }
`;
const ActionButtons = styled.div`
  margin-top: 2.5rem;
  width: 100%;
  display: flex;
  gap: 1rem;
  justify-content: center; ;
`;
const WelcomeSpan = styled.span`
  font-size: 2rem;
  font-weight: 600;
  color: var(--white-color);
  margin-bottom: 5rem;
`;
const NotiSpan = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--white-color);
  margin-bottom: 3rem;
`;
export default ExploreScreen;
