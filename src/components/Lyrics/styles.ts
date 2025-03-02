import { lighten } from "polished";
import styled from "styled-components";

export const Container = styled.div<{ $background: string }>`
  flex: 1;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 1.5rem;
  padding-top: calc(1.5rem + 64px);

  background: ${(props) => props.$background};

  --lyrics-color-background: ${(props) => props.$background};
  --lyrics-color-inactive: rgba(255, 255, 255, 0.4);
  --lyrics-color-passed: rgba(255, 255, 255, 1);
`;

export const LyricsLines = styled.ul`
  position: relative;

  font-weight: 700;
  line-height: 1.8em;

  font-size: 1.2rem;

  @media (min-width: 768px) {
    font-size: 1.4rem;
  }

  @media (min-width: 1280px) {
    font-size: 1.6rem;
  }
`;

export const LyricLine = styled.li<{
  $status: "passed" | "inactive";
}>`
  display: block;
  list-style: none;

  cursor: pointer;
  color: var(--lyrics-color-${(props) => props.$status});

  transition: all 0.1s ease-out;

  &:hover {
    color: var(--lyrics-color-passed);
    text-decoration: underline;
  }
`;

export const LyricLineContent = styled.div`
  display: block;
`;

export const Credits = styled.div`
  margin: 0.4rem;
  margin-top: 2rem;

  max-width: 70%;
  text-align: center;

  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: center;

  color: rgba(255, 255, 255, 0.3);

  a {
    color: inherit;
  }
`;

export const OptionsContainer = styled.ul<{ $background: string }>`
  position: fixed;
  right: 1.6rem;
  bottom: 1.6rem;

  list-style: none;

  width: auto;
  height: min-content;

  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  > li {
    width: 3.2rem;
    height: 3.2rem;

    button {
      width: 100%;
      height: 100%;

      padding: 4px;
      border-radius: 100%;

      border: 0;
      background-color: ${({ $background }) =>
        `${lighten(0.1, $background)}CC`};

      display: flex;
      align-items: center;
      justify-content: center;

      transition: all 0.25s ease-out;

      svg {
        flex: 1;
        color: #fff;
      }
    }

    button:hover {
      background-color: ${({ $background }) => lighten(0.25, $background)};
    }
  }
`;
