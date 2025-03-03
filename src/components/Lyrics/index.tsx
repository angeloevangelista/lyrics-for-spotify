import axios from "axios";
import { BsFullscreen, BsXLg } from "react-icons/bs";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import Loading from "../Loading";
import LyricsError from "../LyricsError";
import { useLyrics } from "../../contexts/LyricsContext";

import * as SC from "./styles";

interface ILyricsLine {
  seconds: number;
  lyrics: string;
}

interface LyricsProps {
  isPlaying?: boolean;
  currentTime?: number;
  background?: string;
  onLineClick?: (seconds: number) => void;
}

const Lyrics: React.FC<LyricsProps> = () => {
  let { song, timestamp, setSong, notifyEvent } = useLyrics();

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [lyrics, setLyrics] = useState<ILyricsLine[] | undefined>();

  const timestampLyricsIndexMap = useMemo(() => {
    if (!song || !lyrics) {
      return {};
    }

    const map: { [key: number]: number } = {};

    let lyricsIndex = 0;

    for (
      let songTimestamp = 0;
      songTimestamp <= song.durationInSeconds;
      songTimestamp++
    ) {
      while (
        lyricsIndex < lyrics.length &&
        lyrics[lyricsIndex].seconds <= songTimestamp
      ) {
        lyricsIndex++;
      }

      map[songTimestamp] = lyricsIndex - 1;
    }

    return map;
  }, [song, lyrics]);

  const loadLyrics = useCallback(async () => {
    if (!song) return;

    try {
      setIsLoading(true);

      const response = await axios.get<ILyricsLine[]>(
        "https://pega-a-letra-pro-pai.onrender.com/api/lyrics",
        {
          params: {
            song: song.title,
            artist: song.artist,
          },
        }
      );

      setLyrics(response.data);
    } catch (error) {
      console.error(error);
      setSong(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [song]);

  useEffect(() => {
    setLyrics(undefined);
    loadLyrics();
  }, [song]);

  useEffect(() => {
    setCurrentLineIndex(timestampLyricsIndexMap[timestamp]);
  }, [timestamp]);

  useEffect(() => {
    const currentLyricsLine = document.querySelector(
      ".current-lyrics-line"
    ) as HTMLElement;

    if (!currentLyricsLine) return;

    const scrollY = Math.floor(
      currentLyricsLine.offsetTop -
        currentLyricsLine.clientHeight / 2 -
        window.innerHeight * 0.2
    );

    window.scrollTo({
      top: scrollY,
      behavior: "smooth",
    });
  }, [currentLineIndex]);

  const handleLyricsLineClick = useCallback(
    (line: ILyricsLine) => {
      notifyEvent("set_timestamp", line.seconds);
    },
    [timestampLyricsIndexMap]
  );

  const handleToggleFullScreen = useCallback(() => {
    notifyEvent("toggle_fullscreen");
  }, []);

  const handleClose = useCallback(() => {
    notifyEvent("request_close");
  }, []);

  return (
    <SC.Container $background={song?.colorTheme ?? "#121212"}>
      {!song && <LyricsError />}

      {isLoading && <Loading />}

      {lyrics && (
        <SC.LyricsLines>
          {lyrics.map((line, index) => (
            <SC.LyricLine
              key={`${line.seconds}-${index}`}
              $status={index <= currentLineIndex ? "passed" : "inactive"}
              className={
                index === currentLineIndex ? "current-lyrics-line" : ""
              }
              onClick={() => handleLyricsLineClick(line)}
            >
              <SC.LyricLineContent>{line.lyrics}</SC.LyricLineContent>
            </SC.LyricLine>
          ))}
        </SC.LyricsLines>
      )}

      <SC.Credits>
        <p>
          Lyrics provided by{" "}
          <a
            href="https://github.com/angeloevangelista/lyrics-for-spotify"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lyrics for Spotify
          </a>
        </p>
      </SC.Credits>

      <SC.OptionsContainer $background={song?.colorTheme ?? "#121212"}>
        <li>
          <button onClick={handleToggleFullScreen}>
            <BsFullscreen />
          </button>
        </li>

        <li>
          <button onClick={handleClose}>
            <BsXLg />
          </button>
        </li>
      </SC.OptionsContainer>
    </SC.Container>
  );
};

export default Lyrics;
