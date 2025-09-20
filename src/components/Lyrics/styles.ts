import { darken, lighten } from "polished";
import styled from "styled-components";

export const Container = styled.div<{
  $background: string;
  $fontColor: string;
}>`
  flex: 1;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 1.5rem;
  padding-top: calc(1.5rem + 64px);

  background: ${(props) => props.$background};

  --lyrics-color-background: ${(props) => props.$background};
  --lyrics-color-inactive: ${(props) => `${props.$fontColor}66`};
  --lyrics-color-passed: ${(props) => props.$fontColor};
`;

export const LyricsLines = styled.ul`
  position: relative;

  font-weight: 700;
  line-height: 1.8em;

  font-size: 1.4rem;

  @media (min-width: 768px) {
    font-size: 1.6rem;
  }

  @media (min-width: 1280px) {
    font-size: 1.8rem;
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

export const Credits = styled.div<{ $fontColor: string }>`
  margin: 0.4rem;
  margin-top: 2rem;

  max-width: 70%;
  text-align: center;

  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: center;

  color: ${(props) => `${props.$fontColor}4D`};

  a {
    color: inherit;
  }
`;

export const OptionsContainer = styled.ul<{
  $background: string;
  $fontColor: string;
}>`
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
    position: relative;

    width: 3.2rem;
    height: 3.2rem;

    > button {
      width: 100%;
      height: 100%;

      padding: 4px;
      border-radius: 100%;

      border: 0;
      box-shadow: 0 0 8px -4px #000000cc;
      background-color: ${({ $background }) =>
        `${lighten(0.1, $background)}CC`};

      display: flex;
      align-items: center;
      justify-content: center;

      transition: all 0.25s ease-out;

      svg {
        width: 2rem;
        color: ${({ $fontColor }) => $fontColor};
      }
    }

    button:hover,
    &.active > button {
      background-color: ${({ $background }) => lighten(0.25, $background)};
    }
  }
`;

export const LookAndFeelContainer = styled.ul<{
  $background: string;
  $fontColor: string;
}>`
  position: absolute;
  bottom: 80%;
  right: 120%;

  padding: 1.4rem;
  border-radius: 8px;

  list-style: none;
  display: flex;
  flex-direction: column;

  gap: 1rem;

  text-align: center;

  > li {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 0.2rem;
  }

  box-shadow: 0 0 8px -4px #000000cc;
  background-color: ${({ $background }) => `${lighten(0.1, $background)}F2`};
`;

export const LookAndFeelItemControls = styled.div<{ $fontColor: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 1rem;

  > button {
    padding: 0.8rem;

    display: flex;
    align-items: center;
    justify-content: center;

    border: 0;
    border-radius: 50%;
    background: none;

    transition: all 0.25s ease-out;
  }

  > svg,
  > button:not(.small) svg {
    width: 1.4rem;
    height: 1.4rem;
    color: ${({ $fontColor }) => $fontColor};
  }
`;

export const ColorPickerContainer = styled.div<{
  $background: string;
  $fontColor: string;
}>`
  position: absolute;
  bottom: 70%;
  right: 70%;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  padding: 1.4rem;
  border-radius: 8px;

  box-shadow: 0 0 8px -4px #000000cc;
  background-color: ${({ $background }) => `${lighten(0.1, $background)}F2`};

  > div.buttons {
    display: flex;
    align-items: center;

    gap: 1rem;

    svg {
      color: ${({ $fontColor }) => $fontColor};
    }

    > button {
      flex: 1;

      height: 2rem;

      display: flex;
      align-items: center;
      justify-content: center;

      border: 0;
      border-radius: 0.4rem;

      background-color: transparent;
      transition: all 0.25s ease-out;

      &:last-child {
        box-shadow: 0 0 8px -4px #000000cc;
        background-color: ${({ $background }) =>
          `${darken(0.1, $background)}80`};

        &:hover {
          background-color: ${({ $background }) => lighten(0.25, $background)};
        }
      }

      &:hover {
        background-color: ${({ $background }) =>
          `${darken(0.1, $background)}33`};
      }
    }
  }
`;
