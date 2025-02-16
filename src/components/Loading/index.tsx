import React from "react";

import * as SC from "./styles";

const Loading: React.FC = () => {
  return (
    <SC.Container>
      <SC.LoadingText>
        <strong>Loading lyrics...</strong>
      </SC.LoadingText>

      <SC.ProgressBarContainer>
        <SC.ProgressBar />
      </SC.ProgressBarContainer>

      <SC.RateMeText>
        <span>Enjoying the extension so far? :D</span>
        {/* <a
          target="_blank"
          href="https://chromewebstore.google.com/detail/lyrics-for-spotify"
        >
          Rate it :D
        </a> */}
      </SC.RateMeText>
    </SC.Container>
  );
};

export default Loading;
