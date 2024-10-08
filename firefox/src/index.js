const currentTimestamp = observable(0);
const currentLyrics = observable([]);
const currentSong = observable({
  title: '',
  artist: '',
});

function getLyricsContainer() {
  if (window.location.pathname !== "/lyrics") return

  const mainViewContainer = document.querySelector('.main-view-container')

  return (
    mainViewContainer.querySelector('[data-testid="fullscreen-lyric"]')?.parentElement
    ||
    mainViewContainer.querySelector('main span')
  )?.parentElement?.parentElement;
}

function renderLyrics() {
  const lyricsContainer = getLyricsContainer();

  if (!lyricsContainer) return

  while (lyricsContainer.querySelectorAll(":scope > *").length > 3) {
    lyricsContainer.querySelector(':scope > :last-child').remove()
  }

  lyricsContainer.style.setProperty('--show-gradient-over-lyrics', 'none');

  const lyricsRootElement = document.createElement('div');
  lyricsRootElement.classList.add('_Wna90no0o0dta47Heiw');
  lyricsRootElement.style.paddingTop = "4rem";

  currentLyrics.value.forEach(line => {
    const lyricsLineElement = document.createElement('div');

    lyricsLineElement.setAttribute('dir', 'auto');
    lyricsLineElement.setAttribute('data-testid', 'fullscreen-lyric');
    lyricsLineElement.dataset.initial_timestamp = line.seconds;
    lyricsLineElement.classList.add('nw6rbs8R08fpPn7RWW2w', 'vapgYYF2HMEeLJuOWGq5');

    lyricsLineElement.innerHTML = `<div class="BXlQFspJp_jq9SKhUSP3">${line.lyrics}</div>`;

    lyricsRootElement.appendChild(lyricsLineElement);
  })

  lyricsRootElement.innerHTML += `
    <div class="LomBcMvfM8AEmZGquAdj">
      <p
        class="encore-text encore-text-body-small"
        data-encore-id="text"
        dir="auto"
      >
        Lyrics provided by 
        <a
          href="https://github.com/angeloevangelista/lyrics-for-spotify"
          target="_blank"
          rel="noopener noreferrer"
        >
          Lyrics for Spotify
        </a>
      </p>
    </div>
  `;

  lyricsContainer.querySelector(":nth-child(2)").innerHTML = '';
  lyricsContainer.querySelector(":nth-child(2)").appendChild(lyricsRootElement);

  setFocusToActiveLine();
}

function setFocusToActiveLine() {
  const lyricsContainer = getLyricsContainer();

  if (!lyricsContainer) return

  const lyricsLines = Array.from(document.querySelectorAll('[data-initial_timestamp]'))

  lyricsLines.forEach((lineElement) => {
    if (Number(lineElement.dataset.initial_timestamp) > currentTimestamp.value) {
      lineElement.classList.remove('EhKgYshvOwpSrTv399Mw');
      return
    }

    lineElement.classList.add('EhKgYshvOwpSrTv399Mw');
    return
  })

  const activeLine = (
    Array.from(lyricsContainer.querySelectorAll('.EhKgYshvOwpSrTv399Mw')).pop()
  ) || lyricsContainer.querySelector('[data-testid=fullscreen-lyric]')

  if (!activeLine) return;

  const scrollY = Math.floor(
    activeLine.offsetTop - (activeLine.clientHeight / 2) - window.innerHeight * 0.20,
  );

  lyricsContainer?.parentElement?.parentElement?.parentElement?.scrollTo({
    top: scrollY,
    behavior: 'smooth'
  });
}

function waitForPlayingBar() {
  return new Promise((resolve, reject) => {
    new MutationObserver((mutationList, observer) => {
      const playingBar = document.querySelector('[data-testid=now-playing-bar]')

      if (!playingBar) return

      if (!document.querySelector('[data-testid=now-playing-widget]')) return
      if (!document.querySelector('[data-testid=lyrics-button]')) return

      observer.disconnect();
      resolve(playingBar);
    }).observe(
      document.body,
      {
        attributes: false,
        childList: true,
        subtree: true,
      },
    )
  })
}

async function initialize() {
  waitForPlayingBar().then(async playingBar => {
    new MutationObserver((mutationList, observer) => {
      const mutationEvent = mutationList.find(p => p.type === 'characterData');

      if (!mutationEvent) return;

      const [minutes, seconds] = mutationEvent.target.textContent.split(':').map(Number);

      currentTimestamp.next(minutes * 60 + seconds)
    }).observe(
      playingBar.querySelector('[data-testid=playback-position]'),
      {
        characterData: true,
        subtree: true,
      },
    )

    new MutationObserver((mutationList, observer) => {
      const addedNodes = mutationList
        .filter(p => p.type === 'childList')
        .reduce((acc, next) => {
          return [...acc, ...next.addedNodes]
        }, []);

      const title = Array
        .from(addedNodes)
        .find(p => p.querySelector('[data-testid=context-item-info-title]'))
        ?.querySelector('[data-testid=context-item-info-title]')
        ?.textContent

      const artist = Array
        .from(addedNodes)
        .find(p => p.querySelector('[data-testid=context-item-info-artist]'))
        ?.querySelector('[data-testid=context-item-info-artist]')
        ?.textContent

      const changedTheSong = !!title && !!artist;
      
      const songIsTheSame = (
        currentSong.value.title === title && currentSong.value.artist === artist
      );

      if (changedTheSong && !songIsTheSame) {
        currentSong.next({ title, artist })
      }
    }).observe(
      playingBar.querySelector('[data-testid=now-playing-widget]'),
      {
        subtree: true,
        childList: true,
      },
    );

    (function () {
      const lyricsButton = document.querySelector('[data-testid=lyrics-button]')

      if (!lyricsButton) return

      const lyricsButtonParent = lyricsButton.parentNode;

      lyricsButton.style.display = 'none';

      const newLyricsButton = document.createElement('button');

      newLyricsButton.classList.add(...lyricsButtonParent.lastChild.classList)

      newLyricsButton.innerHTML = LYRICS_FOR_SPOTIFY_ICON_SVG;

      tippy(newLyricsButton, {
        content: 'Lyrics for Spotify!',
      });

      lyricsButtonParent.insertBefore(newLyricsButton, lyricsButtonParent.firstChild);

      return newLyricsButton;
    })()?.addEventListener(
      'click',
      (e) => {
        if (window.location.pathname !== "/lyrics") {
          window.location.pathname = "/lyrics";
          return
        }
      }
    )

    if (!document.querySelector('[data-testid=context-item-link]')) return

    currentSong.next({
      title: document.querySelector('[data-testid=context-item-link]')?.innerText,
      artist: document.querySelector('[data-testid=context-item-info-artist]')?.innerText,
    });
  })
};

currentSong.subscribe(async next => {
  currentLyrics.next([{ lyrics: "Loading the lyrics...", seconds: 0 }])

  try {
    const songLyricsResponse = await fetch(
      "https://pega-a-letra-pro-pai.onrender.com/api/lyrics?" + new URLSearchParams({
        song: next.title,
        artist: next.artist,
      }),
    );

    const songLyrics = await songLyricsResponse.json();

    currentLyrics.next(
      songLyrics.length
        ? songLyrics
        : [{ lyrics: "Ooops! Nothing for You here, son!", seconds: 0 }]
    );
  } catch (error) {
    console.error(error)
  }
})

currentLyrics.subscribe(renderLyrics);

currentTimestamp.subscribe(setFocusToActiveLine);

initialize();
