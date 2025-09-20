import React, { useMemo } from "react";

import { useTheme } from "../../contexts/ThemeContext";

import * as SC from "./styles";

const LyricsError: React.FC = () => {
  const { theme } = useTheme();

  const errorQuote = useMemo(() => {
    const quotes = [
      "No lyrics here, sorry 💔",
      "💀 Sorry to tell ya...",
      "My horse ate these lyrics, no kidding 🐴",
      "I know I know, sorrrryyy... 😅",
      "This lyrics just vanished... blame Thanos for that 😅",
      "Lyrics? Currently out of stock Try again later!",
      "The melody's here, but the lyrics are playing hide-and-seek",
      "I'm still learning the words Patience, young padawan 🙏",
      "Beep boop No lyrics detected Try again 🤖",
      "Did someone say lyrics? Hmm, not in this file... 🤔",
      "Looks like the lyrics took a vacation! 🏖️",
      "The lyrics are shy Maybe if you sing, they'll come out 🎤 (no they wont)",
      "Are you sure this song really exist??? (sorry)",
      "This area intentionally left blank... no lyrics (just kidding, sorry)",
      "Hold on a sec! I can't remember the lyrics!!!",
      "Lyrics? I seem to have misplaced those 🤷",
      "The artist is still writing it, ist't it?",
      "I'll keep looking... but no promises on lyrics! 👀",
      "The lyrics are shy, but maybe they'll show up later 👻",
      "I don't have the lyrics, but let's sing and guess them! 🎶",
      "I'm still learning, give me a chance at the lyrics! 🤓",
      "The lyrics must have gone on vacation! ✈️",
      "No singing voices detected Please check your mic 🎤",
      "The lyrics are playing a game of hide-and-seek... with me 🕵️",
      "Don't worry, this is probably my fault",
      "Hey! You got the privilege to receive this error message",
      "It seems I'm a song without lyrics... weird 🤪",
      "The singer has gone mute... or maybe I just can't hear 🤫",
      "Lyrics? What lyrics? I'm just a song without words 😶",
      "My friend who writes the lyrics is not home!",
      "I can hum the tune, but not sing the truth 😌",
      "I dare You to sing without the lyrics",
      "No lyrics here, just a melodic mystery 🎵",
      "The lyrics are on a secret mission... shh 🤫",
      "I cannot tell You why the lyrics are not here, it's secret",
      "My lyrics are currently in the washing machine 🧺",
      "Lyrics not included Please use your imagination 💭",
      "Unfortunately, the lyrics are lost in space... again 🚀",
      "My brain is full of music, but no song lyrics 🎶🧠",
      "I'm a song in search of its lyrics... wish me luck! 🍀",
      "Oops! The lyrics got caught in traffic 🚗💨",
      "Lyrics? Nah, just some sweet instrumental vibes 🎸",
      "The lyrics are taking a nap 💤",
      "I don't have the lyrics, but I have some good vibes 🌈",
      "Sorry, the lyrics are currently in a meeting... 🧐",
      "I'm a song in disguise—no words needed 😉",
      "It seems the lyrics went on strike 💼✋",
      "The lyrics are on a coffee break ☕",
      "You know what? I think the lyrics are ghosting us 👻",
      "The lyrics are playing hide and seek, and winning 😎",
      "I'd sing it for you, but the lyrics are at a spa day 🧖‍♀️",
      "Currently under construction—lyrics coming soon 🏗️",
      "The lyrics are at the beach 🏖️ Send a postcard!",
      "Oops, looks like the lyrics took a detour... 😅",
      "The lyrics are on a secret mission, classified info 🔒",
      "No lyrics here, just pure musical magic 🪄",
      "The lyrics are hiding in a secret vault 🏰",
      "Sorry, the lyrics are in a different dimension 🌌",
      "This song's got the vibe, but no words yet ✨",
      "No lyrics for now, but the beat is strong 💪",
      "The lyrics went to a party... without inviting me 🎉",
      "I've got melody, but the lyrics are on vacation 🌴",
      "The lyrics are lost in the digital void 🌐",
      "Just the rhythm, no words—let's freestyle! 🎤",
      "Where did those lyrics go? Maybe they're out shopping 🛍️",
    ];

    return quotes[Math.floor(quotes.length * Math.random())];
  }, []);

  return (
    <SC.Container>
      <SC.ErrorText>
        <h1>Oopsie!</h1>
        <strong>{errorQuote}</strong>
      </SC.ErrorText>

      <SC.ErrorDescription $fontColor={theme.fontColor!}>
        <p>
          Must confess I was a bit lazy with the error handling, so I really
          wish it have taken an smile from You If it keeps happening, please
          reach out on the{" "}
          <a
            href="https://chromewebstore.google.com/detail/ihhndlldaidolpmnejnaioncoonlfaac"
            target="_blank"
            rel="noopener noreferrer"
          >
            extension page
          </a>{" "}
          or{" "}
          <a
            href="https://github.com/angeloevangelista/lyrics-for-spotify"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </SC.ErrorDescription>
    </SC.Container>
  );
};

export default LyricsError;
