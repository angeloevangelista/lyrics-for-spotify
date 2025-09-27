import axios from "axios";
import { FaCheck } from "react-icons/fa";
import { ImFontSize } from "react-icons/im";
import { Colorful } from "@uiw/react-color";
import { PiPaintBrush } from "react-icons/pi";
import { LuPaintRoller } from "react-icons/lu";
import { TbColorSwatch } from "react-icons/tb";
import { BsFullscreen, BsXLg } from "react-icons/bs";
import { PiProhibitInsetBold } from "react-icons/pi";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Loading from "../Loading";
import LyricsError from "../LyricsError";
import { FontSizes, useTheme } from "../../contexts/ThemeContext";
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
  let { theme, setFontColor, setBackgroundColor, setFontSize } = useTheme();
  let { song, timestamp, setSong, notifyEvent } = useLyrics();

  const themeTweakingContainer = useRef<HTMLLIElement>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tweakingState, setTweakingState] = useState<
    "closed" | "choosing" | "font_color" | "background_color"
  >("closed");

  const [lyrics, setLyrics] = useState<ILyricsLine[] | undefined>();

  const backgroundColor = useMemo(
    () => theme.backgroundColor ?? song?.colorTheme ?? "#121212",
    [theme, song]
  );

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
    <SC.Container
      $background={backgroundColor}
      $fontColor={theme.fontColor!}
      onClick={(event) => {
        if (tweakingState === "closed" || !themeTweakingContainer.current) {
          return;
        }

        const clickedOnThemeTweakingContainer =
          themeTweakingContainer.current.contains(event.target as Node);

        if (!clickedOnThemeTweakingContainer) {
          setTweakingState("closed");
        }
      }}
    >
      {!song && <LyricsError />}

      {isLoading && <Loading />}

      {lyrics && (
        <SC.LyricsLines $fontSize={theme.fontSize}>
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

      <SC.Credits $fontColor={theme.fontColor!}>
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

      <SC.OptionsContainer
        $background={backgroundColor}
        $fontColor={theme.fontColor!}
      >
        <li>
          <button onClick={handleToggleFullScreen}>
            <BsFullscreen />
          </button>
        </li>

        <li
          ref={themeTweakingContainer}
          className={tweakingState !== "closed" ? "active" : ""}
        >
          <button
            onClick={() => {
              setTweakingState(
                tweakingState === "closed" ? "choosing" : "closed"
              );
            }}
          >
            <TbColorSwatch />
          </button>

          {tweakingState !== "closed" && (
            <SC.LookAndFeelContainer
              $background={backgroundColor}
              $fontColor={theme.fontColor!}
            >
              <li>
                <SC.LookAndFeelItemControls $fontColor={theme.fontColor!}>
                  <button
                    onClick={() => {
                      const availableFontSizes = Object.values(
                        FontSizes
                      ).filter(
                        (value) => typeof value === "number"
                      ) as number[];

                      const currentIndex = availableFontSizes.indexOf(
                        theme.fontSize
                      );

                      const nextIndex =
                        (currentIndex + 1) % availableFontSizes.length;

                      setFontSize(availableFontSizes[nextIndex]);
                    }}
                  >
                    <ImFontSize />
                  </button>
                </SC.LookAndFeelItemControls>

                <span>{FontSizes[theme.fontSize]}</span>
              </li>

              <li>
                <SC.LookAndFeelItemControls $fontColor={theme.fontColor!}>
                  <button
                    onClick={() => {
                      setTweakingState(
                        tweakingState === "font_color"
                          ? "choosing"
                          : "font_color"
                      );
                    }}
                  >
                    <PiPaintBrush />
                  </button>
                </SC.LookAndFeelItemControls>

                <span>Font Color</span>

                {tweakingState === "font_color" && (
                  <SC.ColorPickerContainer
                    $background={backgroundColor}
                    $fontColor={theme.fontColor!}
                  >
                    <Colorful
                      disableAlpha
                      color={theme.fontColor}
                      onChange={(color) => {
                        setFontColor(color.hex);
                      }}
                    />

                    <div className="buttons">
                      <button
                        onClick={() => {
                          setTweakingState("choosing");
                          setFontColor(undefined);
                        }}
                      >
                        <PiProhibitInsetBold />
                      </button>

                      <button onClick={() => setTweakingState("choosing")}>
                        <FaCheck />
                      </button>
                    </div>
                  </SC.ColorPickerContainer>
                )}
              </li>

              <li>
                <SC.LookAndFeelItemControls $fontColor={theme.fontColor!}>
                  <button
                    onClick={() => {
                      setTweakingState(
                        tweakingState === "background_color"
                          ? "choosing"
                          : "background_color"
                      );
                    }}
                  >
                    <LuPaintRoller />
                  </button>
                </SC.LookAndFeelItemControls>

                <span>Background color</span>

                {tweakingState === "background_color" && (
                  <SC.ColorPickerContainer
                    $background={backgroundColor}
                    $fontColor={theme.fontColor!}
                  >
                    <Colorful
                      disableAlpha
                      color={backgroundColor}
                      onChange={(color) => {
                        setBackgroundColor(color.hex);
                      }}
                    />

                    <div className="buttons">
                      <button
                        onClick={() => {
                          setTweakingState("choosing");
                          setBackgroundColor(undefined);
                        }}
                      >
                        <PiProhibitInsetBold />
                      </button>

                      <button onClick={() => setTweakingState("choosing")}>
                        <FaCheck />
                      </button>
                    </div>
                  </SC.ColorPickerContainer>
                )}
              </li>
            </SC.LookAndFeelContainer>
          )}
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
