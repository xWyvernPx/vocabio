import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
interface WordShort {
  name?: string;
  desc?: string;
  phonetics: [
    {
      text?: string;
      audio?: string;
    }
  ];
}
type Props = {
  word: WordShort;
};
const CardWrapper = styled.div`
  width: 80%;
  background-color: transparent;
  height: 30rem;
  display: inline-block;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  transition: all 0.5s linear;

  perspective: 1000px;
  &.active .card-inner {
    transform: rotateY(180deg);
  }
`;
const CardInner = styled.div`
  border-radius: 20px;
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
`;
const CardFront = styled.div`
  position: absolute;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 5rem;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  background-color: var(--white-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const CardBack = styled.div`
  border-radius: 20px;
  position: absolute;
  box-sizing: border-box;
  padding: 5rem;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  background-color: var(--white-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const VocabCard = ({ word }: Props) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <CardWrapper
      onClick={() => setIsFlipped(!isFlipped)}
      className={`${isFlipped ? 'active' : ''}`}
    >
      <CardInner className="card-inner">
        <CardFront>
          <h1>{word?.name}</h1>
          {/* <h1>pronounce</h1> */}
        </CardFront>
        <CardBack>
          {' '}
          <h1>{word?.desc}</h1>
        </CardBack>
      </CardInner>
    </CardWrapper>
  );
};

export default VocabCard;
