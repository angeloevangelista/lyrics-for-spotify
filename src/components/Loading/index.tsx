import React from "react";

import * as SC from "./styles";
import { useTheme } from "../../contexts/ThemeContext";

const Loading: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SC.Container>
      <SC.LoadingText>
        <strong>Loading lyrics...</strong>
      </SC.LoadingText>

      <SC.ProgressBarContainer $fontColor={theme.fontColor!}>
        <SC.ProgressBar $fontColor={theme.fontColor!} />
      </SC.ProgressBarContainer>

      <SC.RateMeText $fontColor={theme.fontColor!}>
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
