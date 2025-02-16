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

  color: #fff;
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

export const ProgressBarContainer = styled.div`
  width: 12rem;
  height: 0.25rem;

  overflow: hidden;
  border-radius: 9999px;

  background-color: rgba(255, 255, 255, 0.2);
`;

export const ProgressBar = styled.div`
  position: relative;

  width: 60%;
  height: 100%;

  background-color: #fff;
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
      rgba(255, 255, 255, 0.4),
      transparent
    );

    animation: ${shimmer} 2s infinite;
  }
`;

export const RateMeText = styled.div`
  margin: 0.4rem;

  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: center;

  color: rgba(255, 255, 255, 0.3);

  a {
    color: inherit;
    text-decoration: none;
  }
`;
