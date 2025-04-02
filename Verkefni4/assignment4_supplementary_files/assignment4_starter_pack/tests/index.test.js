// Import supertest for HTTP requests
const request = require("supertest");
// Note that we take advantage of @jest/globals (describe, it, expect, etc.)
// Documentation for expect can be found here: https://jestjs.io/docs/expect

const app = require("../index");
const e = require("express");

describe("Endpoint tests", () => {
  // Make sure the server is in default state when testing
  beforeEach(async () => {
    await request(app).get("/api/v1/reset");
  });

  /*---------------------------
   Write your tests below here
  ---------------------------*/
  // Requirements
  // The following requirements/best practices should be following
  // • The backend code should remain unchanged
  // • No extra files should be added. All test code should be added in test/index.test.js.
  // • The tests should be written using Jest and Supertest
  // • There are no restrictions on the ECMAScript (Javascript) version


  // 3.1 Basic Tests (3 tests)
  // For the following endpoints
  // • GET /api/v1/songs
  // • GET /api/v1/playlists/:playlistId
  // • DELETE /api/v1/songs/:songId

  // Write a test, for each of them, that captures the success case (the request succeeds, resulting in
  // a 2xx response code). These tests should not only test the status but also validate the response
  // as described below.
  
  // For endpoints that return arrays, assert the following:
  // • The status code should be as expected (e.g., 200, 201)
  // • The response body is present when it should be
  // • The return type is an array
  // • The array contains the right amount of elements
  
  // For endpoints that return individual objects, assert the following:
  // • The status code should be as expected (e.g., 200, 201)
  // • The response body is present
  // • The response body is as expected
  // – Only the right attributes are in the body
  // – All attributes have the expected values
  
  // Point deductions:
  // 1 point per test. Point deductions when tests
  // are incomplete (e.g., forgotten relevant asser-
  // tions), do not work as intended (e.g., test always
  // passes, leads to crashes), or do not have descrip-
  // tive names/descriptions. No less than 0 points
  // per test through deductions

  // GET /api/v1/songs
  it("GET /api/v1/songs should return a 200 status and an array of all songs", async () => {
    const response = await request(app).get("/api/v1/songs");
    // • The status code should be as expected (e.g., 200, 201)
    expect(response.statusCode).toBe(200);
    // • The response body is present when it should be
    expect(response.body).toBeTruthy(); // to be truthy ensures that the response body is not null, undefined, 0, false, NaN or an empty string ("")
    // • The return type is an array
    expect(Array.isArray(response.body)).toBeTruthy();
    // • The array contains the right amount of elements
    expect(response.body).toHaveLength(8);

    // expect properties
    const expectedAttributes = ["id", "title", "artist"];
    response.body.forEach((song) => {
      // • Only the right attributes are in the body
      expect(Object.keys(song)).toEqual(expectedAttributes);
    });

    // expect values
    response.body.forEach((song) => {
      expect(song).toHaveProperty("id");
      expect(song).toHaveProperty("title");
      expect(song).toHaveProperty("artist");
      expect(typeof song.id).toBe("number");
      expect(typeof song.title).toBe("string");
      expect(typeof song.artist).toBe("string");
    });
  });

  it("Get /api/v1/songs should return correct filtered songs", async () => {
    // test the filter query
    const response = await request(app).get("/api/v1/songs?filter=Lady Gaga");
    // • The status code should be as expected (e.g., 200, 201)
    expect(response.statusCode).toBe(200);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The response body is as expected
    // – Only the right attributes are in the body
    // – All attributes have the expected values
    expect(response.body).toHaveLength(1);
    expect(response.body).toContainEqual({ id: 4, title: "Abracadabra", artist: "Lady Gaga" });
  });

  it ("GET /api/v1/songs should return a 400 status and an error message when trying to use a query parameter other than 'filter'", async () => {
    const response = await request(app).get("/api/v1/songs?search=Lady Gaga");
    // • The status code should be correct
    expect(response.statusCode).toBe(400);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "Invalid query parameter. Only \"filter\" is allowed." });
  });

  it("Get /api/v1/songs should return an empty array if no song where found", async () => {
    const response = await request(app).get("/api/v1/songs?filter=Gamli Noi");
    // • The status code should be as expected (e.g., 200, 201)
    expect(response.statusCode).toBe(200);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The response body is as expected
    // – Only the right attributes are in the body
    // – All attributes have the expected values
    expect(response.body).toEqual([]);
  });

  
  
  it("GET /api/v1/playlists/:playlistId should return a 200 status and an object of the playlist", async () => {
    const response = await request(app).get("/api/v1/playlists/1");
    // • The status code should be as expected (e.g., 200, 201)
    expect(response.statusCode).toBe(200);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The response body is as expected
    // – Only the right attributes are in the body
    // – All attributes have the expected values
    expect(response.body).toEqual({
      id: 1,
      name: "Hot Hits Iceland",
      songIds: [1, 2, 3, 4],
      songs: [
        { id: 1, title: "Cry For Me", artist: "The Weeknd" },
        { id: 2, title: "Busy Woman", artist: "Sabrina Carpenter" },
        { id: 3, title: "Call Me When You Break Up", artist: "Selena Gomez, benny blanco, Gracie Adams" },
        { id: 4, title: "Abracadabra", artist: "Lady Gaga" },
      ],
    });
  });

  it("DELETE /api/v1/songs/:songId should return a 200 status, delete the song and return the deleted song, you should not be able to delete a song which is linked to a playlist", async () => {
    const response = await request(app).delete("/api/v1/songs/7");
    // • The status code should be as expected (e.g., 200, 201)
    expect(response.statusCode).toBe(200);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The response body is as expected
    // – Only the right attributes are in the body
    // – All attributes have the expected values
    expect(response.body).toEqual({id: 7, title: "Lucy", artist: "Idle Cave"});

    // check if the song is deleted
    const songs = await request(app).get("/api/v1/songs");
    expect(songs.body).toHaveLength(7);
  });
  
  it("DELETE /api/v1/songs/:songId should return a 400 status and an error message when trying to delete a song that is linked to a playlist", async () => {
    const response = await request(app).delete("/api/v1/songs/1");
    // • The status code should be correct
    expect(response.statusCode).toBe(400);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The response body is as expected
    // – Only the right attributes are in the body
    // – All attributes have the expected values
    expect(response.body).toEqual({ message: "Cannot delete song with songid 1 as it is linked to a playlist." });
    
    // check if the song is still there
    const song_response = await request(app).get("/api/v1/songs");
    expect(song_response.body).toContainEqual({ id: 1, title: "Cry For Me", artist: "The Weeknd" });
  });

  it("DELETE /api/v1/songs/:songId should return a 405 status and an error message when trying to delete a song with a method that is not allowed", async () => {
    const response = await request(app).delete("/api/v1/songs").send({ id: 1 });
    // • The status code should be correct
    expect(response.statusCode).toBe(405);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "Method Not Allowed" });
  });


  // 3.2 Failure Tests (5 tests)
  // In addition to the 3 success cases described in 3.1, write 5 tests for the following failure cases:
  // • PATCH /api/v1/playlists/:playlistId/songs/:songId should fail when the submit-
  //   ted song (songId) is already on the playlist (playlistId)
  // • PATCH /api/v1/songs/:songId should fail when a request is made with a non-empty
  //   request body that does not contain any valid property for a song (title, artist)
  // • GET /api/v1/playlists/:playlistId should fail when the playlist with the provided id
  //   does not exist
  // • POST /api/v1/songs should fail when the request body does not contain the artist
  //   property
  // • POST /api/v1/playlists should fail when missing the correct authorization

  // For each of the failure cases, assert the following:
  // • The status code should be correct
  // • The response body is present
  // • The error message is as expected
  
  // Point deductions:
  // 1 point per test. Point deductions when tests
  // are incomplete (e.g., forgotten relevant asser-
  // tions), do not work as intended (e.g., test always
  // passes, leads to crashes), or do not have descrip-
  // tive names/descriptions. No less than 0 points
  // per test through deductions

  it("PATCH /api/v1/playlists/:playlistId/songs/:songId should fail when the submitted song (songId) is already on the playlist (playlistId)", async () => {
    const response = await request(app).patch("/api/v1/playlists/2/songs/6");
    // • The status code should be correct
    expect(response.statusCode).toBe(400)
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "Song with id 6 already exists in playlist with id 2." });

    // check if the song is in the playlist
    const song_response = await request(app).get("/api/v1/playlists/2");
    expect(song_response.body.songIds).toContain(6);
  });

  it("PATCH /api/v1/playlists/:playlistId/songs/:songId should fail when the playlistId is not an integer", async () => {
    const response = await request(app).patch("/api/v1/playlists/heh/songs/6");
    // • The status code should be correct
    expect(response.statusCode).toBe(400);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "playlistId must be an integer." });
  });

  it("PATCH /api/v1/playlists/:playlistId/songs/:songId should fail when the songId is not an integer", async () => {
    const response = await request(app).patch("/api/v1/playlists/6/songs/heh");
    // • The status code should be correct
    expect(response.statusCode).toBe(400);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "songId must be an integer." });
  });

  it("PATCH /api/v1/songs/:songId should fail when a request is made with a non-empty request body that does not contain any valid property for a song (title, artist)", async () => {
    const response = await request(app).patch("/api/v1/songs/2").send({ name: "Benjamin" }); // using send to send a request body
    // • The status code should be correct
    expect(response.statusCode).toBe(400);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "To update a song you must provide at least one field: title or artist."});

    // check if the song is still the same as it was
    const all_songs_response = await request(app).get("/api/v1/songs");
    expect(all_songs_response.body).toContainEqual({ id: 2, title: "Busy Woman", artist: "Sabrina Carpenter" });
  });

  it("PATCH /api/v1/songs/:songId should fail when the songId is not an integer", async () => {
    const response = await request(app).patch("/api/v1/songs/heh").send({ title: "Benjamin" });
    // • The status code should be correct
    expect(response.statusCode).toBe(400);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "songId must be an integer" });

    // check if the song is still the same as it was
    const all_songs_response = await request(app).get("/api/v1/songs");
    expect(all_songs_response.body).toContainEqual({ id: 2, title: "Busy Woman", artist: "Sabrina Carpenter" });
  });

  it("GET /api/v1/playlists/:playlistId should fail when the playlist with the provided id does not exist", async () => {
    const response = await request(app).get("/api/v1/playlists/101");
    // • The status code should be correct
    expect(response.statusCode).toBe(404);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "Playlist with id 101 does not exists." });
  });

  it("GET /api/v1/playlists/:playlistId should fail when the playlistId is not an integer", async () => {
    const response = await request(app).get("/api/v1/playlists/heh");
    // • The status code should be correct
    expect(response.statusCode).toBe(400);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "playlistId must be an integer" });
  });

  it("POST /api/v1/songs should fail when the request body does not contain the artist property", async () => {
    const response = await request(app).post("/api/v1/songs").send({ title: "Gamli Noi" });
    // • The status code should be correct
    expect(response.statusCode).toBe(400);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "Song requires a title and an artist." });
  });

  it("POST /api/v1/songs should fail when the request body contains a title that is not a string", async () => {
    const response = await request(app).post("/api/v1/songs").send({ title: 123, artist: "Gamli Noi" });
    // • The status code should be correct
    expect(response.statusCode).toBe(400);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "title should be a string" });
  });
    
  it("POST /api/v1/songs should fail when the request body contains an artist that is not a string", async () => {
    const response = await request(app).post("/api/v1/songs").send({ title: "Gamli Noi", artist: 123 });
    // • The status code should be correct
    expect(response.statusCode).toBe(400);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "artist should be a string" });
  });

  it("POST /api/v1/songs should fail when the request body contains a song that already exists, with the same title and artist", async () => {
    const response = await request(app).post("/api/v1/songs").send({ title: "Cry For Me", artist: "The Weeknd" });
    // • The status code should be correct
    expect(response.statusCode).toBe(400);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "A song with title Cry For Me and artist The Weeknd already exists." });
  });

  it("POST /api/v1/playlists should fail when missing the correct authorization", async () => {
    const response = await request(app).post("/api/v1/playlists").send({ name: "Iceland Top 3" });
    // • The status code should be correct
    expect(response.statusCode).toBe(401);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "Unauthorized" });

  });


  // 3.3 POST Playlist Tests (1 test)
  // Assume that you have intercepted the request depicted in Figure 1. Write a test that demon-
  // strates that you can run a "replay attack" with a different request body using the intercepted
  // information. In your test case, it is sufficient to assert that a 201 response code has been returned.
  // The intercepted request is also found in the file intercept.txt in the supplement material.
  
  // Point deductions:
  // Up to 2 point for this test. Point deductions
  // when tests are incomplete (e.g., forgotten rele-
  // vant assertions), do not work as intended (e.g.,
  // test always passes, leads to crashes), or do not
  // have descriptive names/descriptions. No less
  // than 0 points per test through deductions

  // Figure 1
  // POST /api/v1/playlists HTTP/1.1
  // Host: localhost:3000
  // Authorization: HMAC 4aa4f59d77ca3f3fec33bfee6afbc14f152dbee74ff9492a30a6191d63675015
  // Content-Type: application/json
  // Content-Length: 36

  // {
  //     "name": "Fantastic playlist"
  // }

  // replay attack demonstration with a different request body using the intercepted information
  it("POST /api/v1/playlists replay attack demonstration with a different request body using the intercepted information", async () => {
    // The secret is musicSecret
    const response = await request(app).post("/api/v1/playlists").set(
      "Authorization",
      "HMAC 4aa4f59d77ca3f3fec33bfee6afbc14f152dbee74ff9492a30a6191d63675015"
    ).send({ name: "Iceland Top 3" });

    // • The status code should be correct
    expect(response.statusCode).toBe(201);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The response body is as expected
    // – Only the right attributes are in the body
    // – All attributes have the expected values
    expect(response.body).toEqual({ id: 4, name: "Iceland Top 3", songIds: [] });
  });
 
  it("POST /api/v1/playlists should return a 403 status and an error message when using the wrong authorization method", async () => {
    const response = await request(app).post("/api/v1/playlists").set(
      "Authorization",
      "MACH 4aa4f59d77ca3f3fec33bfee6afbc14f152dbee74ff9492a30a6191d63675015"
    ).send({ name: "Iceland Top 3" });

    // • The status code should be correct
    expect(response.statusCode).toBe(403);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "Wrong authorization method." });
  });

  it("POST /api/v1/playlists should return a 403 status and an error message when using the wrong authorization hash", async () => {
    const response = await request(app).post("/api/v1/playlists").set(
      "Authorization",
      "HMAC 4aa4f59d77ca3f3fec33bfee6afbc14f152dbee74ff9492a30a6191d63675016"
    ).send({ name: "Iceland Top 3" });

    // • The status code should be correct
    expect(response.statusCode).toBe(403);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "Wrong hash." });  
  });

  it("POST /api/v1/playlists should return a 400 status and an error message when the request body does not contain the name property", async () => {
    const response = await request(app).post("/api/v1/playlists").set(
      "Authorization",
      "HMAC 4aa4f59d77ca3f3fec33bfee6afbc14f152dbee74ff9492a30a6191d63675015"
    ).send({ title: "Iceland Top 3" });

    // • The status code should be correct
    expect(response.statusCode).toBe(400);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "name should be a string" });
  });

  it("POST /api/v1/playlists should return a 400 status and an error message when the request body contains an empty name", async () => {
    const response = await request(app).post("/api/v1/playlists").set(
      "Authorization",
      "HMAC 4aa4f59d77ca3f3fec33bfee6afbc14f152dbee74ff9492a30a6191d63675015"
    ).send({ name: "" });

    // • The status code should be correct
    expect(response.statusCode).toBe(400);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "Playlist requires a valid name." });
  });

  it("POST /api/v1/playlists should return a 400 status and an error message when the request body contains a name that already exists", async () => {
    const response = await request(app).post("/api/v1/playlists").set(
      "Authorization",
      "HMAC 4aa4f59d77ca3f3fec33bfee6afbc14f152dbee74ff9492a30a6191d63675015"
    ).send({ name: "Hot Hits Iceland" });

    // • The status code should be correct
    expect(response.statusCode).toBe(400);
    // • The response body is present
    expect(response.body).toBeTruthy();
    // • The error message is as expected
    expect(response.body).toEqual({ message: "A playlist with name Hot Hits Iceland already exists." });
  });


  // Try to call and endpoint that does not exists
  it("Example Test: should return a 404 status for a non-existent endpoint", async () => {
    const response = await request(app).get("/api/v1/nonExistentEndpoint");
    expect(response.statusCode).toBe(404);
  });
});
