import Lyrics from "./components/Lyrics";
import { LyricsContextProvider } from "./contexts/LyricsContext";
import { ThemeContextProvider, useTheme } from "./contexts/ThemeContext";

import { globalStyles as GlobalStyles } from "./styles";

const AppContent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <>
      <Lyrics />
      <GlobalStyles $fontColor={theme.fontColor ?? "red"} />
    </>
  );
};

function App() {
  return (
    <LyricsContextProvider>
      <ThemeContextProvider>
        <AppContent />
      </ThemeContextProvider>
    </LyricsContextProvider>
  );
}

export default App;
