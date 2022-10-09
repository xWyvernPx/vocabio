import React from 'react';
import styled from 'styled-components';

type Props = {};

const Wrapper = styled.div`
  position: fixed;
  background-color: rgba(240, 242, 250, 0.5);
  z-index: 250;
  inset: 0;
  /* top: 50%; */
  /* left: 50%; */
  display: grid;
  place-items: center;
  .dashed-loading {
    transform: translate(-25px, -25px);
    position: relative;
    height: 50px;
  }

  .dashed-loading:after,
  .dashed-loading:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }

  .dashed-loading:before {
    z-index: 5;
    border: 3px dashed #ff6bcb;
    border-left: 3px solid transparent;
    border-bottom: 3px solid transparent;
    -webkit-animation: dashed 1s linear infinite;
    animation: dashed 1s linear infinite;
  }

  .dashed-loading:after {
    z-index: 10;
    border: 3px solid #ffb86c;
    border-left: 3px solid transparent;
    border-bottom: 3px solid transparent;
    -webkit-animation: dashed 1s ease infinite;
    animation: dashed 1s ease infinite;
  }

  @keyframes dashed {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Loading = (props: Props) => {
  return (
    <Wrapper>
      <div className="dashed-loading"></div>
    </Wrapper>
  );
};

export default Loading;
