import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface IThemeContextProps {
  children: React.ReactNode;
}

interface ITheme {
  fontSize: number;
  fontColor: string;
  backgroundColor?: string;
}

type IThemeContextData = {
  theme: ITheme;
  setFontSize: React.Dispatch<number>;
  setFontColor: React.Dispatch<string | undefined>;
  setBackgroundColor: React.Dispatch<string | undefined>;
};

const DEFAULT_FONT_COLOR = "#ffffff";
const LOCAL_STORAGE_THEMES_KEY = "lyrics_for_spotify:theme";

const ThemeContext = createContext<IThemeContextData>({} as IThemeContextData);

const ThemeContextProvider: React.FC<IThemeContextProps> = ({ children }) => {
  const [theme, setTheme] = useState<ITheme>({
    fontSize: 24,
    fontColor: DEFAULT_FONT_COLOR,
  });

  useEffect(() => {
    const rawValue = localStorage.getItem(LOCAL_STORAGE_THEMES_KEY);

    if (!rawValue) {
      handleThemeUpdate(theme);
      return;
    }

    setTheme(JSON.parse(rawValue));
  }, []);

  const handleThemeUpdate = useCallback((newTheme: ITheme) => {
    localStorage.setItem(LOCAL_STORAGE_THEMES_KEY, JSON.stringify(newTheme));
    setTheme(newTheme);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setFontSize: (fontSize) => {
          handleThemeUpdate({ ...theme, fontSize });
        },
        setFontColor: (fontColor) => {
          handleThemeUpdate({
            ...theme,
            fontColor: fontColor ?? DEFAULT_FONT_COLOR,
          });
        },
        setBackgroundColor: (backgroundColor) => {
          handleThemeUpdate({ ...theme, backgroundColor });
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { ThemeContextProvider, useTheme };
