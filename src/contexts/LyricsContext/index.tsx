import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import lightOrDarkColor from "@check-light-or-dark/color";
import { average } from "color.js";
import { darken } from "polished";

interface ILyricsContextProps {
  children: React.ReactNode;
}

interface ISong {
  title: string;
  artist: string;
  coverArt: string;
  durationInSeconds: number;
  colorTheme: string;
}

interface ILyricsContextData {
  song?: ISong;
  timestamp: number;

  setSong: React.Dispatch<React.SetStateAction<ISong | undefined>>;
  notifyEvent: (key: string, data: any) => void;
}

interface IAppEvent {
  key: string;
  data: any;
}

const LyricsContext = createContext<ILyricsContextData>(
  {} as ILyricsContextData
);

const LyricsContextProvider: React.FC<ILyricsContextProps> = ({ children }) => {
  const [song, setSong] = useState<ISong>();
  const [timestamp, setTimestamp] = useState<number>(0);

  const songRef = useRef<ISong | undefined>(undefined);

  useEffect(() => {
    songRef.current = song;
  }, [song]);

  const handleUpdateTimestampEvent = useCallback((newTimestamp: number) => {
    setTimestamp(newTimestamp);
  }, []);

  const handleUpdateSongEvent = useCallback(async (newSong: ISong) => {
    if (!newSong || newSong.title === songRef.current?.title) return;

    newSong.colorTheme = (await average(newSong.coverArt, {
      format: "hex",
    })) as string;

    [newSong.colorTheme, darken(0.5, newSong.colorTheme), "#121212"].forEach(
      (newColor) => {
        if (lightOrDarkColor(newSong.colorTheme) === "light") {
          newSong.colorTheme = newColor;
        }
      }
    );

    setSong(newSong);
  }, []);

  const handleEnableAdvertisementEvent = useCallback(() => {
    console.log("ADVERTISEMENT");
    setSong(undefined);
  }, []);

  useEffect(() => {
    const handleMessageEvent = async (event: MessageEvent<IAppEvent>) => {
      if (!["https://open.spotify.com"].includes(event.origin)) return;

      switch (event.data?.key) {
        case "update_timestamp":
          handleUpdateTimestampEvent(event.data.data);
          break;

        case "update_song":
          handleUpdateSongEvent(event.data.data);
          break;

        case "enable_advertisement":
          handleEnableAdvertisementEvent();
          break;
      }
    };

    window.addEventListener("message", handleMessageEvent);

    return () => {
      window.removeEventListener("message", handleMessageEvent);
    };
  }, []);

  const notifyEvent = useCallback((key: string, data: any) => {
    top?.postMessage(
      {
        key,
        data,
      },
      "*"
    );
  }, []);

  return (
    <LyricsContext.Provider
      value={{
        song,
        timestamp,

        setSong,
        notifyEvent,
      }}
    >
      {children}
    </LyricsContext.Provider>
  );
};

const useLyrics = () => useContext(LyricsContext);

export { LyricsContextProvider, useLyrics };
