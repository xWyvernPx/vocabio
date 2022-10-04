import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch } from 'react-redux';
import 'swiper/css';
import VocabCard from 'renderer/_components/common/card/VocabCard';
import {
  PrimaryButton,
  PrimaryOutlineButton,
  SuccessButton,
  WarningButton,
} from 'renderer/_components/common/button/PrimaryButton';
import { openModal } from 'renderer/redux/slice/modalSlice';
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
const HomeScreen = (props: Props) => {
  const [swiperRef, setSwiperRef] = useState<any>();
  const dispatch = useDispatch();
  return (
    <Screen>
      <WelcomeSpan>Welcome back, Phong</WelcomeSpan>
      <NotiSpan>You have 30 words need to be reviewed</NotiSpan>
      <CardSlider>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          autoHeight={true}
          onSlideChange={(e) => console.log()}
          onSwiper={(swiper) => setSwiperRef(swiper)}
          effect={'cards'}
          cardsEffect={{}}
        >
          <SwiperSlide vocab="123">
            <VocabCard />
          </SwiperSlide>
          <SwiperSlide>
            <VocabCard />
          </SwiperSlide>
          <SwiperSlide>
            <VocabCard />
          </SwiperSlide>
          <SwiperSlide>
            <VocabCard />
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
        <SuccessButton
          onClick={() => {
            dispatch(
              openModal({
                componentName: 'SENTENCE_WITH_WORD',
                payload: '',
              })
            );
          }}
        >
          Continue (continue after)
        </SuccessButton>
        <WarningButton onClick={() => swiperRef?.slideNext()}>
          later
        </WarningButton>
      </ActionButtons>
    </Screen>
  );
};

export default HomeScreen;
