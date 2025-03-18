const express = require("express");
const sha256 = require("js-sha256");

/* Import a body parser module to be able to access the request body as json */
const bodyParser = require("body-parser");

/* Use cors to avoid issues with testing on localhost */
const cors = require("cors");

const app = express();

/* Base url parameters and port settings */
const apiPath = "/api/";
const version = "v1";
const port = 3000;

/* Set Cors-related headers to prevent blocking of local requests */
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/*  Initial Data 
    Notice we use 'let' instead of 'const' so that resetState can re-declare*/
let songs = [
  { id: 1, title: "Cry For Me", artist: "The Weeknd" },
  { id: 2, title: "Busy Woman", artist: "Sabrina Carpenter" },
  {
    id: 3,
    title: "Call Me When You Break Up",
    artist: "Selena Gomez, benny blanco, Gracie Adams",
  },
  { id: 4, title: "Abracadabra", artist: "Lady Gaga" },
  { id: 5, title: "Róa", artist: "VÆB" },
  { id: 6, title: "Messy", artist: "Lola Young" },
  { id: 7, title: "Lucy", artist: "Idle Cave" },
  { id: 8, title: "Eclipse", artist: "parrow" },
];

let playlists = [
  { id: 1, name: "Hot Hits Iceland", songIds: [1, 2, 3, 4] },
  { id: 2, name: "Workout Playlist", songIds: [2, 5, 6] },
  { id: 3, name: "Lo-Fi Study", songIds: [] },
];

/*  Our id counters
    We use basic integer ids here, but other solutions (such as UUIDs) would be better */
let nextSongId = 9;
let nextPlaylistId = 4;

/* Addition to the assignment 3 solution to help you have a "clean-base" for your testing */
app.get(apiPath + version + "/reset", (req, res) => {
  songs = [
    { id: 1, title: "Cry For Me", artist: "The Weeknd" },
    { id: 2, title: "Busy Woman", artist: "Sabrina Carpenter" },
    {
      id: 3,
      title: "Call Me When You Break Up",
      artist: "Selena Gomez, benny blanco, Gracie Adams",
    },
    { id: 4, title: "Abracadabra", artist: "Lady Gaga" },
    { id: 5, title: "Róa", artist: "VÆB" },
    { id: 6, title: "Messy", artist: "Lola Young" },
    { id: 7, title: "Lucy", artist: "Idle Cave" },
    { id: 8, title: "Eclipse", artist: "parrow" },
  ];

  playlists = [
    { id: 1, name: "Hot Hits Iceland", songIds: [1, 2, 3, 4] },
    { id: 2, name: "Workout Playlist", songIds: [2, 5, 6] },
    { id: 3, name: "Lo-Fi Study", songIds: [] },
  ];

  nextSongId = 9;
  nextPlaylistId = 4;

  return res.status(200).json({ message: "State reset successful." });
});

/* --------------------------

        SONGS ENDPOINTS     

-------------------------- */

/* SONGS 3.1 GET songs */
app.get(apiPath + version + "/songs", (req, res) => {
  // Define allowed query parameters
  const allowedQueryParams = ["filter"];
  // Get all query parameters from the request
  const queryParams = Object.keys(req.query);
  // Check if only allowed query parameters have been sent with the request
  const isQueryParamAllowed = queryParams.every((param) =>
    allowedQueryParams.includes(param)
  );

  if (!isQueryParamAllowed) {
    // If there are query parameters other than 'filter', return a 400 Bad Request
    return res.status(400).json({
      message: 'Invalid query parameter. Only "filter" is allowed.',
    });
  }

  const songsArray = [];

  // Add all books to the bookArray, if no filter was applied
  if (!req.query.filter) {
    songs.map((song) =>
      songsArray.push({
        id: song.id,
        title: song.title,
        artist: song.artist,
      })
    );
  } else {
    // Find the relevant songs from the filter, using lowercase to be avoid case-sensitivity
    const filteredSongs = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(req.query.filter.toLowerCase()) ||
        song.artist.toLowerCase().includes(req.query.filter.toLowerCase())
    );

    // Return an empty array if no song where found
    if (filteredSongs.length === 0) {
      return res.status(200).json([]);
    }

    // Add all songs, for the filtered request to the songsArray
    filteredSongs.forEach((song) =>
      songsArray.push({
        id: song.id,
        title: song.title,
        artist: song.artist,
      })
    );
  }

  res.status(200).json(songsArray);
});

/* SONGS 3.2 POST a new song */
app.post(apiPath + version + "/songs", (req, res) => {
  /* Deconstruct title and artist from the body */
  let { title, artist } = req.body;
  if (typeof title === "string") title = title.trim();
  if (typeof artist === "string") artist = artist.trim();

  /* Check if all necessary parameters are included in the POST request */
  if (!req.body || !title || !artist) {
    return res.status(400).json({
      message: "Song requires a title and an artist.",
    });
  }

  /* Check if the body parameters are of the correct format */
  if (typeof title !== "string") {
    return res.status(400).json({
      message: "title should be a string",
    });
  }
  if (typeof artist !== "string") {
    return res.status(400).json({
      message: "artist should be a string",
    });
  }

  /* Create a new song object */
  const newSong = {
    id: nextSongId,
    title: title,
    artist: artist,
  };

  /* Check if song with this title and artist exists, return an 400 error if it exists before */
  if (
    songs.some(
      (song) =>
        song.title.toLowerCase() === newSong.title.toLowerCase() &&
        song.artist.toLowerCase() === newSong.artist.toLowerCase()
    )
  ) {
    return res.status(400).json({
      message: `A song with title ${newSong.title} and artist ${newSong.artist} already exists.`,
    });
  }

  /* Add the new song, and increment nextSongId for future requests */
  songs.push(newSong);
  nextSongId++;

  /* Return the new song, with 201 Created */
  res.status(201).json(newSong);
});

/* SONGS 3.3 PATCH songs */
app.patch(apiPath + version + "/songs/:songId", (req, res) => {
  /* Validate that songId is an integer */
  const songId = parseInt(req.params.songId);
  if (!Number.isInteger(songId)) {
    return res.status(400).json({
      message: `songId must be an integer`,
    });
  }

  /* Extract title, and artist from the request body */
  const { title, artist } = req.body;

  /* Check if at least one valid field is provided */
  if (!req.body || (!title && !artist)) {
    return res.status(400).json({
      message:
        "To update a song you must provide at least one field: title or artist.",
    });
  }

  /* Find the song */
  const foundSongIndex = songs.findIndex((song) => song.id === songId);

  /* If the song does not exist, return 404 */
  if (foundSongIndex === -1) {
    return res
      .status(404)
      .json({ message: `Song with id ${songId} does not exist.` });
  }

  /* Update title if provided */
  if (title && typeof title === "string") {
    songs[foundSongIndex].title = title;
  }

  /* Update artist if provided */
  if (artist && typeof artist === "string") {
    songs[foundSongIndex].artist = artist;
  }

  /* Return the updated song */
  return res.status(200).json(songs[foundSongIndex]);
});

/* SONGS 3.4 DELETE a song (only if not linked to any playlist) */
app.delete(apiPath + version + "/songs/:songId", (req, res) => {
  /* Set, and parse the songId to integer */
  const songId = parseInt(req.params.songId);

  /* Check if songId is of correct type */
  if (!Number.isInteger(songId)) {
    return res.status(400).json({
      message: `songId must be an integer`,
    });
  }

  /* Find the index for the song, for deletion */
  const deletedSongIndex = songs.findIndex(
    (song) => parseInt(song.id) === songId
  );

  /* If the song in the request is not found, response with 404 not found */
  if (deletedSongIndex < 0) {
    return res.status(404).json({
      message: `Song with id ${songId} does not exist.`,
    });
  }

  /* Check if the requested song, is used in any playlists */
  const songIsLinkedToPlaylist = playlists.some((playlist) =>
    playlist.songIds.includes(songId)
  );

  /* If the song is used in a playlist, then return 400 bad request */
  if (songIsLinkedToPlaylist) {
    return res.status(400).json({
      message: `Cannot delete song with songid ${songId} as it is linked to a playlist.`,
    });
  }

  /* Get the song before deletion */
  const deletedSong = songs[deletedSongIndex];

  /* Remove the song from the songs array */
  songs.splice(deletedSongIndex, 1);

  /* Return the deleted song in the body with 200 OK */
  res.status(200).json(deletedSong);
});

/*  SONGS 3.4 
    Handler to catch DELETE requests without a specific songId 
    and return a 405 Method Not Allowed. This can either be 
    done seperately or within the allowed get request with 
    and optional parameter songId */
app.delete(apiPath + version + "/songs", (req, res) =>
  res.status(405).json({
    message: "Method Not Allowed",
  })
);

/* --------------------------

      PLAYLISTS ENDPOINTS    

-------------------------- */

/* PLAYLISTS 3.1 GET all playlists */
app.get(apiPath + version + "/playlists", (req, res) => {
  res.status(200).json(playlists);
});

/* PLAYLISTS 3.2 GET a specific playlist with full song details */
app.get(apiPath + version + "/playlists/:playlistId", (req, res) => {
  /* Set, and parse the playlistId to integer */
  const playlistId = parseInt(req.params.playlistId);

  /* Check if playlistId is of correct type */
  if (!Number.isInteger(playlistId)) {
    return res.status(400).json({
      message: "playlistId must be an integer",
    });
  }

  /* Find the requested playlist */
  const playlist = playlists.find((p) => p.id === playlistId);

  /* If the playlist in the request is not found, response with 404 not found */
  if (!playlist) {
    return res
      .status(404)
      .json({ message: `Playlist with id ${playlistId} does not exists.` });
  }

  /* Populate song details for the playlist */
  const playlistWithSongs = {
    ...playlist,
    songs: playlist.songIds.map((songId) =>
      songs.find((song) => song.id === songId)
    ),
  };

  /* Return the playlist with full song details */
  res.status(200).json(playlistWithSongs);
});

/* PLAYLISTS 3.3 POST a new playlist */
app.post(apiPath + version + "/playlists", (req, res) => {
  /* Authentication check */
  const hmacHash = sha256.hmac(
    "musicSecret",
    req.method.toLowerCase() + " " + req.path.toLowerCase()
  );

  if (!req.header("Authorization")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const authMethod = req.header("Authorization").substring(0, 4);
  const hash = req.header("Authorization").substring(5);

  if (authMethod !== "HMAC") {
    return res.status(403).json({ message: "Wrong authorization method." });
  }

  if (hash !== hmacHash) {
    return res.status(403).json({ message: "Wrong hash." });
  }

  /* Ensure req.body exists and name is defined */
  if (!req.body || typeof req.body.name !== "string") {
    return res.status(400).json({
      message: "name should be a string",
    });
  }

  /* Deconstruct name from the body */
  const name = req.body.name.trim();

  /* Check if the name is empty after trimming */
  if (name === "") {
    return res.status(400).json({
      message: "Playlist requires a valid name.",
    });
  }

  /* Create a new playlist object */
  const newPlaylist = {
    id: nextPlaylistId,
    name: name,
    songIds: [],
  };

  /* Check if a playlist with this name exists, return an 400 error if it exists before */
  if (
    playlists.some(
      (playlist) =>
        playlist.name.toLowerCase() === newPlaylist.name.toLowerCase()
    )
  ) {
    return res.status(400).json({
      message: `A playlist with name ${newPlaylist.name} already exists.`,
    });
  }

  /* Add the new playlist, and increment nextPlaylistId for future requests */
  playlists.push(newPlaylist);
  nextPlaylistId++;

  /* Return the new playlist */
  res.status(201).json(newPlaylist);
});

/* PLAYLISTS 3.5 PATCH add a song to a playlist */
app.patch(
  apiPath + version + "/playlists/:playlistId/songs/:songId",
  (req, res) => {
    /* Set, and parse the playlistId and songId to integer */
    const playlistId = parseInt(req.params.playlistId);
    const songId = parseInt(req.params.songId);

    /* Check if playlistId is of correct type */
    if (!Number.isInteger(playlistId)) {
      return res.status(400).json({
        message: "playlistId must be an integer.",
      });
    }

    /* Check if songId is of correct type */
    if (!Number.isInteger(songId)) {
      return res.status(400).json({
        message: "songId must be an integer.",
      });
    }

    /* Find the playlist */
    const playlist = playlists.find((playlist) => playlist.id === playlistId);

    /* If the playlist in the request is not found, response with 404 not found */
    if (!playlist) {
      return res
        .status(404)
        .json({ message: `Playlist with id ${playlistId} does not exist.` });
    }

    /* Find the song  */
    const song = songs.find((song) => song.id === songId);

    /* If the song in the request is not found, response with 404 not found */
    if (!song) {
      return res
        .status(404)
        .json({ message: `Song with id ${songId} does not exist.` });
    }

    /* Check if the song already exists in a playlist */
    if (playlist.songIds.includes(songId)) {
      return res.status(400).json({
        message: `Song with id ${songId} already exists in playlist with id ${playlistId}.`,
      });
    }

    /* Add song to playlist songIds array */
    playlist.songIds.push(songId);

    /* Return the playlist with the newly added song */
    res.status(200).json(playlist);
  }
);

/* --------------------------

      SERVER INITIALIZATION  
      
!! DO NOT REMOVE OR CHANGE THE FOLLOWING (IT HAS TO BE AT THE END OF THE FILE) !!
      
-------------------------- */
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

/* Export the app for testing */
module.exports = app;
