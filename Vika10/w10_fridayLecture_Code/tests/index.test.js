// Import supertest for HTTP requests
const request = require("supertest");
// Note that we take advantage of @jest/globals (describe, it, expect, etc.)
// Documentation for expect can be found here: https://jestjs.io/docs/expect

const app = require("../index");

describe("Endpoint tests", () => {
  // Make sure the server is in default state when testing
  beforeEach(async () => {
    await request(app).get("/api/v1/reset");
  });

  /*---------------------------
   Write your tests below here
  ---------------------------*/

  /* ---- Success Tests ---- 
  For endpoints that return arrays, assert the following:
  - The status code should be as expected (e.g. 200,201)
  - The response body is present when it should be
  - The return type is an array
  - The array contains the right amount of elements*/
  it("GET Events: Should successfully return all events", async () => {
    const response = await request(app).get("/api/v1/events");
    // The status code should be as expected (e.g. 200,201)
    expect(response.statusCode).toBe(200);
    // The return type is an array
    expect(Array.isArray(response.body)).toBeTruthy();
    // The array contains the right amount of elements
    expect(response.body).toHaveLength(3);
  });
  /* ---- Success Tests ---- 
  For endpoints that return individual objects, assert the following:
  - The status code should be as expected (e.g. 200,201)
  - The response body is present
  - The response body is as expected:
    - Only the right attributes are in the body
    - All attributes have the expected values
  */

  it("GET Events: Should successfully return event with id 2, with all attributes", async () => {
    const response = await request(app).get("/api/v1/events/2");
    // The status code should be as expected (e.g. 200,201)
    expect(response.statusCode).toBe(200);
    // The response body is present AND Only the right attributes are in the body
    const expectedAttributes = ["id", "name", "date", "location"];
    expect(Object.keys(response.body)).toEqual(expectedAttributes);
    // All attributes have the expected values
    expect(response.body).toHaveProperty("id", 2);
    expect(response.body).toHaveProperty("name", "Art & Design Workshop");
    expect(response.body).toHaveProperty("date", "2024-06-20");
    expect(response.body).toHaveProperty(
      "location",
      "Downtown Art Studio, Creativetown"
    );
  });

  it("POST Events: Should successfully create an event", async () => {
    const newEvent = {
      name: "April Celebration",
      date: "2025-04-01",
      location: "Reykjavik University",
    };
    const response = await request(app).post("/api/v1/events").send(newEvent);
    // The status code should be as expected (e.g. 200,201)
    expect(response.statusCode).toBe(201);
    // The response body is present
    // AND Only the right attributes are in the body
    // AND All attributes have the expected values
    expect(response.body).toEqual({
      id: 4,
      name: "April Celebration",
      date: "2025-04-01",
      location: "Reykjavik University",
    });
  });

  it("GET Attendes: Should successfully return all attendees to event 1", async () => {
    const response = await request(app).get("/api/v1/events/1/attendees");
    // The status code should be as expected (e.g. 200,201)
    expect(response.statusCode).toBe(200);
    // The return type is an array
    expect(Array.isArray(response.body)).toBeTruthy();
    // The array contains the right amount of elements
    expect(response.body).toHaveLength(2);
  });

  /* ---- Failure tests ---- 
  For each of the failure tests, assert the following:
  - The status code should be correct
  - The response body is present
  - The error message is as expected
  */
  it("POST Event: Should return a 400 error for trying to create an incomplete event", async () => {
    const newEvent = {
      name: "May Celebration",
      date: "2025-05-01",
    };
    const response = await request(app).post("/api/v1/events").send(newEvent);
    // The status code should be correct
    expect(response.statusCode).toBe(400);
    // The response body is present AND The error message is as expected
    expect(response.body.message).toBe(
      "Missing required field(s). Name, date, and location are required."
    );
  });

  it("POST Event: Should return a 400 error for trying to create an event with broken date", async () => {
    const newEvent = {
      name: "May Celebration",
      date: "2025-05",
      location: "Reykjavik University",
    };
    const response = await request(app).post("/api/v1/events").send(newEvent);
    // The status code should be correct
    expect(response.statusCode).toBe(400);
    // The response body is present AND The error message is as expected
    expect(response.body.message).toBe("Invalid date format. Use YYYY-MM-DD.");
  });

  // Try to call and endpoint that does not exists
  it("Example Test: should return a 404 status for a non-existent endpoint", async () => {
    const response = await request(app).get("/api/v1/nonExistentEndpoint");
    expect(response.statusCode).toBe(404);
  });
});
