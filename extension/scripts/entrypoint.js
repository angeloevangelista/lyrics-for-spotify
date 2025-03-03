function waitForElement(container, selector) {
  return new Promise((resolve, _) => {
    new MutationObserver((_, observer) => {
      const foundElement = container.querySelector(selector)

      if (!foundElement) return

      observer.disconnect();
      resolve(foundElement);
    }).observe(
      container,
      {
        attributes: false,
        childList: true,
        subtree: true,
      },
    )
  });
}

function isDevMode() {
  return false; //!('update_url' in chrome.runtime.getManifest());
}

function getExtensionFrameOrigin() {
  const localhostUrl = "http://localhost:5173/dist";
  const bundleUrl = chrome.runtime.getURL("dist/index.html");

  return isDevMode() ? localhostUrl : bundleUrl
}

async function injectLyricsContainer() {
  const mainViewContainer = await waitForElement(document, ".main-view-container")

  const lyricsContainerIframe = document.createElement("iframe");

  lyricsContainerIframe.src = getExtensionFrameOrigin();

  lyricsContainerIframe.id = "lyrics-for-spotify-lyrics-iframe";
  lyricsContainerIframe.classList.add("hide");

  mainViewContainer.appendChild(lyricsContainerIframe);
}

function toggleLyrics(action) {
  const lyricsContainerIframe = document.querySelector("#lyrics-for-spotify-lyrics-iframe");

  notifyEvent("update_song", getCurrentSong())

  if (action === undefined) {
    if (lyricsContainerIframe.classList.contains("hide")) {
      lyricsContainerIframe.classList.remove("hide");
    } else {
      lyricsContainerIframe.classList.add("hide");
    }

    return
  }

  switch (action) {
    case "show":
      if (lyricsContainerIframe.classList.contains("hide")) {
        lyricsContainerIframe.classList.remove("hide");
      }
      break;

    case "hide":
      if (!lyricsContainerIframe.classList.contains("hide")) {
        lyricsContainerIframe.classList.add("hide");
      }
      break;
  }
}

async function injectExtensionButton() {
  const originalLyricsButton = await waitForElement(document, '[data-testid=lyrics-button]');

  const extensionButton = document.createElement('button');
  extensionButton.id = "lyrics-for-spotify-lyrics-button";
  extensionButton.classList.add(...originalLyricsButton.classList);

  tippy(extensionButton, {
    content: 'Lyrics for Spotify!',
  });

  const extensionButtonSpan = document.createElement('span');
  extensionButtonSpan.classList.add(...originalLyricsButton.querySelector("span").classList);
  extensionButtonSpan.innerHTML = LYRICS_FOR_SPOTIFY_ICON_SVG;

  extensionButton.appendChild(extensionButtonSpan);

  originalLyricsButton.parentNode.insertBefore(extensionButton, originalLyricsButton);

  extensionButton.addEventListener("click", () => toggleLyrics());
}

async function injectCloseBehaviorOnNativeActions() {
  const containersThatClosesLyrics = [
    "ul:has([data-testid=top-sentinel])",
    "[data-testid=global-nav-bar]",
    "[data-testid=lyrics-button]",
    "[data-testid=fullscreen-mode-button]",
    "[data-testid=now-playing-widget]",
  ]

  await Promise.all(
    containersThatClosesLyrics.map(async selector => {
      const container = await waitForElement(document, selector);
      container.addEventListener("click", () => toggleLyrics("hide"));
    }),
  );
}

function notifyEvent(key, data) {
  document.querySelector("#lyrics-for-spotify-lyrics-iframe")?.contentWindow?.postMessage(
    {
      key,
      data,
    },
    "*",
  );
}

function getCurrentSong(containersToQueryOn) {
  if (!containersToQueryOn) {
    containersToQueryOn = [];
  }

  containersToQueryOn.push(document);

  const title = Array.from(containersToQueryOn)
    ?.find(p => p.querySelector('[data-testid=context-item-info-title]'))
    ?.querySelector('[data-testid=context-item-info-title]')
    ?.textContent

  const artist = Array.from(containersToQueryOn)
    ?.find(p => p.querySelector('[data-testid=context-item-info-subtitles]'))
    ?.querySelector('[data-testid=context-item-info-subtitles]')
    ?.textContent

  const coverArt = Array.from(containersToQueryOn)
    ?.find(p => p.querySelector('[data-testid=cover-art-button] img'))
    ?.querySelector('[data-testid=cover-art-button] img')
    ?.src;

  const durationInSeconds = Math.floor(
    Number(
      Array.from(containersToQueryOn)
        ?.find(p => p.querySelector('[data-testid=playback-progressbar] label input'))
        ?.querySelector('[data-testid=playback-progressbar] label input')
        ?.max
    ) / 1000
  );

  const hasSong = !!title && !!artist && !!coverArt && !!durationInSeconds;

  if (!hasSong) return;

  return {
    title,
    artist,
    coverArt,
    durationInSeconds,
  }
}

async function handleUpdateTimestampEvent(timestamp) {
  console.log({ source: "handleUpdateTimestampEvent", timestamp })
}

async function handleToggleFullscreenEvent() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    return
  }

  const lyricsContainerIframe = document.querySelector("#lyrics-for-spotify-lyrics-iframe");

  lyricsContainerIframe.requestFullscreen();
}

async function handleRequestCloseEvent() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }

  toggleLyrics();
}

async function observeTrackControlChanges() {
  new MutationObserver((mutationList, observer) => {
    const mutationEvent = mutationList.find(p => p.type === 'characterData');

    if (!mutationEvent) return;

    const [minutes, seconds] = mutationEvent.target.textContent.split(':').map(Number);

    notifyEvent("update_timestamp", minutes * 60 + seconds)
  }).observe(
    document.querySelector('[data-testid=playback-position]'),
    {
      characterData: true,
      subtree: true,
    },
  )
}

async function observeSongChanges() {
  new MutationObserver((mutationList, observer) => {
    const addedNodes = mutationList
      .filter(p => p.type === 'childList')
      .reduce((acc, next) => {
        return [...acc, ...next.addedNodes]
      }, []);

    notifyEvent("update_song", getCurrentSong(addedNodes));
  }).observe(
    document.querySelector('[data-testid=now-playing-widget]'),
    {
      subtree: true,
      childList: true,
    },
  );
}

async function observeForAdvertisement() {
  new MutationObserver((mutationList, observer) => {
    const addedNodes = mutationList
      .filter(p => p.type === 'childList')
      .reduce((acc, next) => {
        return [...acc, ...next.addedNodes]
      }, []);

    const isRunningAdvertisement = !!Array
      .from(addedNodes)
      ?.find(p => p.querySelector && p.querySelector('[data-testid=ad-companion-card]'));

    if (!isRunningAdvertisement) return;

    notifyEvent("enable_advertisement");
  }).observe(
    document.querySelector('#Desktop_PanelContainer_Id'),
    {
      subtree: true,
      childList: true,
    },
  );
}

function listenToLyricsNotifications() {
  window.addEventListener(
    "message",
    (event) => {
      // if (event.origin !== getExtensionFrameOrigin()) return;

      switch (event.data?.key) {
        case "set_timestamp":
          handleUpdateTimestampEvent(event.data.data);
          break;
        case "toggle_fullscreen":
          handleToggleFullscreenEvent();
          break;
        case "request_close":
          handleRequestCloseEvent();
          break;
      }
    },
  );
}

async function initialize() {
  await injectLyricsContainer();
  await injectExtensionButton();
  await injectCloseBehaviorOnNativeActions();

  observeTrackControlChanges();
  observeSongChanges();
  observeForAdvertisement();
  listenToLyricsNotifications();
};

initialize();
