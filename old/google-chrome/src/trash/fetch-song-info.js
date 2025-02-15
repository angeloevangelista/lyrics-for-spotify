async function fetchSongInfoFromSpotify(trackId) {
  const {
    granted_token: {
      token: spotifyClientToken,
    },
  } = await fetch("https://clienttoken.spotify.com/v1/clienttoken", {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      client_data: {
        client_version: "1.0",
        client_id: "d8a5ed958d274c2e8ee717e6a4b0971d",
        js_sdk_data: {}
      }
    }),
    "method": "POST",
  }).then(response => response.json());


  const response = await fetch(
    "https://api-partner.spotify.com/pathfinder/v1/query?" + new URLSearchParams({
      operationName: 'getTrack',
      variables: JSON.stringify({
        "uri": `spotify:track:${trackId}`
      }),
      extensions: JSON.stringify({
        "persistedQuery": {
          "version": 1,
          "sha256Hash": "ae85b52abb74d20a4c331d4143d4772c95f34757bfa8c625474b912b9055b5c0"
        }
      }),
    }).toString(),
    {
      headers: {
        authorization: 'Bearer BQBkvODxldddmWR2VsEpK1BI1ZIIkQnrCeBHvfGRysGUdGQxEQem7vZmeaLaGmE56c6EXVFokWZo-KosUaK3OqlUv43IyFY2VKoUXxps5AfqfIBeTxw',
        "client-token": spotifyClientToken,
        accept: "application/json"
      }
    }).then(response => response.json());
}