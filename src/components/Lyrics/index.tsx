import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import Loading from "../Loading";
import { useLyrics } from "../../contexts/LyricsContext";

import * as SC from "./styles";
import LyricsError from "../LyricsError";

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

  const [lyrics, setLyrics] = useState<ILyricsLine[] | undefined>([
    {
      seconds: 6,
      lyrics: "For a while there it was rough",
    },
    {
      seconds: 9,
      lyrics: "But lately I've been doin' better",
    },
    {
      seconds: 13,
      lyrics: "Than the last four cold Decembers I recall",
    },
    {
      seconds: 20,
      lyrics: "And I see my family every month",
    },
    {
      seconds: 23,
      lyrics: "I found a girl my parents love",
    },
    {
      seconds: 27,
      lyrics: "She'll come and stay the night",
    },
    {
      seconds: 28,
      lyrics: "And I think I might have it all",
    },
    {
      seconds: 34,
      lyrics: "And I thank God every day",
    },
    {
      seconds: 37,
      lyrics: "For the girl",
    },
    {
      seconds: 38,
      lyrics: "He sent my way",
    },
    {
      seconds: 40,
      lyrics: "But I know the things",
    },
    {
      seconds: 42,
      lyrics: "He gives me",
    },
    {
      seconds: 43,
      lyrics: "He can take away",
    },
    {
      seconds: 47,
      lyrics: "And I hold you every night",
    },
    {
      seconds: 50,
      lyrics: "And that's a feeling I wanna get used to",
    },
    {
      seconds: 55,
      lyrics: "But there's no man as terrified",
    },
    {
      seconds: 59,
      lyrics: "As the man who stands to lose you",
    },
    {
      seconds: 67,
      lyrics: "Oh I hope I don't lose you",
    },
    {
      seconds: 73,
      lyrics: "Please stay",
    },
    {
      seconds: 77,
      lyrics: "I want you I need you oh God",
    },
    {
      seconds: 80,
      lyrics: "Don't take",
    },
    {
      seconds: 84,
      lyrics: "These beautiful things that I've got",
    },
    {
      seconds: 87,
      lyrics: "Please stay",
    },
    {
      seconds: 91,
      lyrics: "I want you I need you oh God",
    },
    {
      seconds: 93,
      lyrics: "Don't take",
    },
    {
      seconds: 97,
      lyrics: "These beautiful things that I've got",
    },
    {
      seconds: 100,
      lyrics: "Oh ooh",
    },
    {
      seconds: 107,
      lyrics: "Please don't take",
    },
    {
      seconds: 112,
      lyrics: "I found my mind I'm feelin' sane",
    },
    {
      seconds: 116,
      lyrics: "It's been a while but I'm finding my faith",
    },
    {
      seconds: 119,
      lyrics: "If everything's good and it's great",
    },
    {
      seconds: 121,
      lyrics: "Why do I sit and wait 'til it's gone",
    },
    {
      seconds: 125,
      lyrics: "Oh I'll tell ya I know I've got enough",
    },
    {
      seconds: 129,
      lyrics: "I've got peace and I've got love",
    },
    {
      seconds: 133,
      lyrics: "But I'm up at night thinkin' I just might lose it all",
    },
    {
      seconds: 141,
      lyrics: "Please stay",
    },
    {
      seconds: 145,
      lyrics: "I want you I need you oh God",
    },
    {
      seconds: 148,
      lyrics: "Don't take",
    },
    {
      seconds: 152,
      lyrics: "These beautiful things that I've got",
    },
    {
      seconds: 155,
      lyrics: "Oh ooh",
    },
    {
      seconds: 162,
      lyrics: "Please stay",
    },
    {
      seconds: 166,
      lyrics: "I want you I need you oh God",
    },
    {
      seconds: 169,
      lyrics: "I need",
    },
    {
      seconds: 173,
      lyrics: "These beautiful things that I've got",
    },
  ]);

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
    const currentILyricsLine = document.querySelector(
      ".current-lyrics-line"
    ) as HTMLElement;

    if (!currentILyricsLine) return;

    const scrollY = Math.floor(
      currentILyricsLine.offsetTop -
        currentILyricsLine.clientHeight / 2 -
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

  return (
    <SC.Container $background={song?.colorTheme ?? ""}>
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
    </SC.Container>
  );
};

export default Lyrics;
