import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import 'swiper/css';
import VocabCard from 'renderer/_components/common/card/VocabCard';
import {
  PrimaryButton,
  PrimaryOutlineButton,
  SuccessButton,
  WarningButton,
} from 'renderer/_components/common/button/PrimaryButton';
import { closeModal, openModal } from 'renderer/redux/slice/modalSlice';
import Loading from 'renderer/_components/common/loading/Loading';
import ConfirmModal from 'renderer/_components/common/modal/ConfirmModal';
import { gql, useApolloClient } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import {
  closeConfirmModal,
  openConfirmModal,
} from 'renderer/redux/slice/confirmModalSlice';
import { toast } from 'react-toastify';
type Props = {};

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
const GET_LEARNING_WORDS = gql`
  query {
    learningWords {
      word
      reviewLevel
      nextReview
    }
  }
`;
const GET_REVIEW_LEVEL = gql`
  query {
    reviewLevels {
      level
      reviewAfterPeriod
    }
  }
`;
const REVIEW_UP_LEVEL_MUTATION = gql`
  mutation ($word: String) {
    reviewWordUpLevel(word: $word)
  }
`;
const HomeScreen = (props: Props) => {
  const [swiperRef, setSwiperRef] = useState<any>();

  const [currentSlide, setCurrentSlide] = useState<number | any>(0);
  const dispatch = useDispatch();
  const [learningWords, setLearningWords] = useState<any>([]);
  const [reviewLevels, setReviewLevels] = useState<any>();
  const client = useApolloClient();
  const getLearningWords = useCallback(() => {
    client
      .query({ query: GET_LEARNING_WORDS, fetchPolicy: 'no-cache' })
      .then((result) => result.data.learningWords)
      .then((result) => setLearningWords([...result]));
  }, [learningWords]);
  const getReviewLevels = useCallback(() => {
    client
      .query({ query: GET_REVIEW_LEVEL, fetchPolicy: 'no-cache' })
      .then((result) => result.data.reviewLevels)
      .then((result) => {
        const levelMap = new Map();
        result.forEach((reviewLevel: any) =>
          levelMap.set(reviewLevel.level, reviewLevel.reviewAfterPeriod)
        );
        setReviewLevels(levelMap);
      });
  }, []);
  const currentWord = useMemo(
    () => learningWords?.[currentSlide]?.word,
    [currentSlide, swiperRef, learningWords]
  );
  useEffect(() => {
    getLearningWords();
    getReviewLevels();
  }, []);

  const user = useSelector((state: any) => state.auth.user);
  const reviewKeepLevelHandler = useCallback(() => {
    const currentWord = swiperRef?.slides[currentSlide].getAttribute('vocab');
    const REVIEW_KEEP_LEVEL_MUTATION = gql`
      mutation ($word: String) {
        reviewWordKeepLevel(word: $word)
      }
    `;
    dispatch(
      openConfirmModal({
        content: 'Learn this word.',
        confirmAction: async () => {
          const result = await client
            .mutate({
              mutation: REVIEW_KEEP_LEVEL_MUTATION,
              variables: { word: currentWord },
            })
            .then((result) => result.data.reviewWordKeepLevel);
          if (result) {
            setLearningWords(
              learningWords.filter((word: any) => word.word != currentWord)
            );
            toast.success('word will be review later');
            dispatch(closeConfirmModal());
          } else {
            toast.error('Something went wrong');
            dispatch(closeConfirmModal());
          }
        },
      })
    );
  }, [learningWords, currentSlide, swiperRef]);
  return (
    <Screen>
      <WelcomeSpan>Welcome back, {user?.username || 'User'}</WelcomeSpan>
      <NotiSpan>
        You have {learningWords?.length || 0} words need to be reviewed
      </NotiSpan>
      <CardSlider>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          autoHeight={true}
          onSlideChange={(e) => setCurrentSlide(e.activeIndex)}
          onSwiper={(swiper) => setSwiperRef(swiper)}
          effect={'cards'}
          cardsEffect={{}}
        >
          {learningWords?.map((word: any) => (
            <SwiperSlide vocab={word?.word}>
              <VocabCard word={word} key={word.word} />
            </SwiperSlide>
          ))}
        </Swiper>
      </CardSlider>
      <ActionButtons>
        <PrimaryOutlineButton
          onClick={() =>
            dispatch(
              openModal({
                componentName: 'WORD_DETAIL',
                payload: { word: currentWord },
              })
            )
          }
        >
          Learn more
        </PrimaryOutlineButton>
        <SuccessButton
          onClick={() => {
            dispatch(
              openModal({
                componentName: 'SENTENCE_WITH_WORD',
                payload: {
                  reviewDoneHandler: async () => {
                    const result = await client
                      .mutate({
                        mutation: REVIEW_UP_LEVEL_MUTATION,
                        variables: { word: currentWord },
                      })
                      .then((result) => result.data.reviewWordUpLevel);
                    if (result) {
                      toast.success('You reviewed this word');
                      setLearningWords(
                        learningWords.filter(
                          (word: any) => word.word != currentWord
                        )
                      );
                      dispatch(closeModal());
                    } else {
                      toast.error('Something went wrong');
                      dispatch(closeModal());
                    }
                  },
                  reviewFailureHandler: () => {
                    toast.error('You failed to review this word. Try again');
                    dispatch(closeModal());
                  },
                },
              })
            );
          }}
        >
          Continue (review after{' '}
          {reviewLevels?.get(learningWords[currentSlide]?.reviewLevel)} days)
        </SuccessButton>
        <WarningButton onClick={reviewKeepLevelHandler}>later</WarningButton>
      </ActionButtons>
    </Screen>
  );
};

export default HomeScreen;
