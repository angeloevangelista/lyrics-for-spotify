import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

export const Container = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const LoadingText = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    font-size: 1.5rem;
    font-weight: 600;
    animation: ${pulse} 2s infinite;
  }
`;

export const ProgressBarContainer = styled.div<{ $fontColor: string }>`
  width: 12rem;
  height: 0.25rem;

  overflow: hidden;
  border-radius: 9999px;

  background-color: ${(props) => `${props.$fontColor}33`};
`;

export const ProgressBar = styled.div<{ $fontColor: string }>`
  position: relative;

  width: 60%;
  height: 100%;

  /* background-color: #fff; */
  border-radius: 9999px;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      ${(props) => `${props.$fontColor}66`},
      transparent
    );

    animation: ${shimmer} 2s infinite;
  }
`;

export const RateMeText = styled.div<{ $fontColor: string }>`
  margin: 0.4rem;

  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: center;

  color: ${(props) => `${props.$fontColor}4D`};

  a {
    color: inherit;
    text-decoration: none;
  }
`;
