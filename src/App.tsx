import Lyrics from "./components/Lyrics";
import { LyricsContextProvider } from "./contexts/LyricsContext";

import { globalStyles as GlobalStyles } from "./styles";

function App() {
  return (
    <LyricsContextProvider>
      <Lyrics />
      <GlobalStyles />
    </LyricsContextProvider>
  );
}

export default App;
