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

enum FontSizes {
  "small",
  "medium",
  "large",
}

interface ITheme {
  fontSize: FontSizes;
  fontColor: string;
  backgroundColor?: string;
}

type IThemeContextData = {
  theme: ITheme;
  setFontSize: React.Dispatch<FontSizes>;
  setFontColor: React.Dispatch<string | undefined>;
  setBackgroundColor: React.Dispatch<string | undefined>;
};

const DEFAULT_FONT_SIZE = FontSizes.small;
const DEFAULT_FONT_COLOR = "#ffffff";
const LOCAL_STORAGE_THEMES_KEY = "lyrics_for_spotify:theme";

const ThemeContext = createContext<IThemeContextData>({} as IThemeContextData);

const ThemeContextProvider: React.FC<IThemeContextProps> = ({ children }) => {
  const [theme, setTheme] = useState<ITheme>({
    fontSize: DEFAULT_FONT_SIZE,
    fontColor: DEFAULT_FONT_COLOR,
  });

  useEffect(() => {
    const rawValue = localStorage.getItem(LOCAL_STORAGE_THEMES_KEY);

    if (!rawValue) {
      handleThemeUpdate(theme);
      return;
    }

    const nextTheme = JSON.parse(rawValue) as ITheme;

    // adjust ITheme.fontSize
    {
      const fontSizeValues = Object.values(FontSizes).filter(
        (v) => typeof v === "number"
      ) as number[];

      const parsedFontSize = Number(nextTheme.fontSize);

      nextTheme.fontSize = fontSizeValues.includes(parsedFontSize)
        ? parsedFontSize
        : DEFAULT_FONT_SIZE;
    }

    setTheme(nextTheme);
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

export { ThemeContextProvider, useTheme, FontSizes };
