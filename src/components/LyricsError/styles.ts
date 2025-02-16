import styled from "styled-components";

export const Container = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  color: #fff;
`;

export const ErrorText = styled.div`
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;

  strong {
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

export const ErrorDescription = styled.div`
  max-width: 70%;
  text-align: center;

  margin: 0.4rem;

  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: center;

  color: rgba(255, 255, 255, 0.3);

  a {
    color: inherit;
  }
`;
