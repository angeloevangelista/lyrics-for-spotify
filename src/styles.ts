import { createGlobalStyle } from "styled-components";

const globalStyles = createGlobalStyle<{
  $fontColor: string;
}>`
  :root {
    font-family: "Raleway", sans-serif;
  }

  body {
    background-color: #121212;
  }

  #root {
    display: flex;
    flex-direction: column;

    min-height: 100vh;

    color: ${({ $fontColor }) => $fontColor};
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  button {
    cursor: pointer;
  }
`;

export { globalStyles };
