import { createGlobalStyle } from "styled-components";

const globalStyles = createGlobalStyle`
  :root {
    font-family: sans-serif;
  }

  #root {
    display: flex;
    flex-direction: column;

    height: 100vh;

    color: #fff;
    background-color: #121212;
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
