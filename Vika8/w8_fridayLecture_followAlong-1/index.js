// Various settings for the RESTful API using express.js + node.js
const express = require("express");

// Import a body parser module to be able to access the request body as json
const bodyParser = require("body-parser");

// Use cors to avoid issues with testing on localhost
const cors = require("cors");

const app = express();

const apiPath = "/api/";
const version = "v1";

const port = 3000;

// Tell express to use the body parser module
app.use(bodyParser.json());

// Tell express to use cors -- enables CORS for this backend
app.use(cors());

// Set Cors-related headers to prevent blocking of local requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const destinations = [
  {
    id: 1,
    country: "Italy",
    knownFor: "Rich history, art, and cuisine",
    bestTime: "April to June, September to October",
  },
  {
    id: 2,
    country: "Japan",
    knownFor: "Cherry blossoms, traditional and modern culture",
    bestTime: "March to May, October to November",
  },
];

const attractions = [
  {
    id: 1,
    destinationId: 1,
    name: "Colosseum",
    type: "Historical Site",
    description: "Iconic ancient Roman gladiatorial arena.",
    visitDuration: "2-3 hours",
  },
  {
    id: 2,
    destinationId: 1,
    name: "Venice Canals",
    type: "Cultural Experience",
    description: "Famous canals and romantic gondola rides.",
    visitDuration: "1 day",
  },
  {
    id: 3,
    destinationId: 2,
    name: "Mount Fuji",
    type: "Natural Landmark",
    description: "Japan's tallest mountain and iconic symbol.",
    visitDuration: "Full day",
  },
  {
    id: 4,
    destinationId: 2,
    name: "Tokyo Tower",
    type: "Observation Deck",
    description: "Offers panoramic views of Tokyo.",
    visitDuration: "1-2 hours",
  },
];

/* YOUR CODE STARTS HERE */

/* Read all Destinations
Requirement: Retrieves a list of all destinations, including 
              all details for each destination.
URL: http://localhost:3000/api/v1/destinations
Method: GET
Input: None
Output: 
      An array of destination objects.
      Example:
      [
        {
          "id": 1,
          "country": "Italy",
          "knownFor": "Rich history, art, and cuisine",
          "bestTime": "April to June, September to October"
        },
        {
          "id": 2,
          "country": "Japan",
          "knownFor": "Cherry blossoms, traditional and modern culture",
          "bestTime": "March to May, October to November"
        }
      ] */
app.get(apiPath + version + "/destinations", (req, res) => {
  res
    .status(501)
    .json({ message: "This endpoint has not been implemented yet" });
});

/* Read all attractions 
Requirement: Retrieves a list of all attractions, including 
             all details for each attraction. 
URL: http://localhost:3000/api/v1/attractions
Method: GET
Input: None
Output: 
      An array of attraction objects.
      Example:
      [
        {
          "id": 1,
          "destinationId": 1,
          "name": "Colosseum",
          "type": "Historical Site",
          "description": "Iconic ancient Roman gladiatorial arena.",
          "visitDuration": "2-3 hours"
        },
        {
          "id": 2,
          "destinationId": 1,
          "name": "Venice Canals",
          "type": "Cultural Experience",
          "description": "Famous canals and romantic gondola rides.",
          "visitDuration": "1 day"
        }
      ] */
app.get(apiPath + version + "/attractions", (req, res) => {
  res
    .status(501)
    .json({ message: "This endpoint has not been implemented yet" });
});

/* Create a new attraction 
Requirement: Creation of a new attraction with all details. 
URL: http://localhost:3000/api/v1/destinations/:destinationId/attractions
Method: POST
Input: 
      Body: object containing information of all attributes of the
            new attraction (excluding id and destinationId). 
      Url parameter: destinationId
      Example Input:
      {
        "destinationId": 1,
        "name": "Leaning Tower of Pisa",
        "type": "Historical Landmark",
        "description": "Famous leaning bell tower in Pisa, Italy.",
        "visitDuration": "1-2 hours"
      }
Output: 
      The newly created attraction object with id.
      Example Output:
      {
        "id": 5,
        "destinationId": 1,
        "name": "Leaning Tower of Pisa",
        "type": "Historical Landmark",
        "description": "Famous leaning bell tower in Pisa, Italy.",
        "visitDuration": "1-2 hours"
      } */
app.post(
  apiPath + version + "/destinations/:destinationId/attractions",
  (req, res) => {
    const { name, type, description, visitDuration } = req.body;

    const DestinationIndex = destinations.findIndex(
      (destination) => destination.id === Number(req.params.destinationId)
    );
    if (DestinationIndex < 0) {
      return res.status(404).json({
        message: 'Destination with id ' + req.params.destinationId + ' not found'
      });
    }

    res
      .status(501)
      .json({ message: "This endpoint has not been implemented yet" });
  }
);

/*NOTE: Never hand in anything like the following, but this could be helpful 
in development to detecting issues with your endpoints*/
console.log("----------------------------");
console.log("All available endpoints are:");
console.log("----------------------------");
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    // Only include routes
    console.log(
      Object.keys(middleware.route.methods)
        .map((key) => key.toUpperCase())
        .join(", ") +
        " " +
        middleware.route.path
    );
  }
});
console.log("----------------------------");

/* YOUR CODE ENDS HERE */

/* DO NOT REMOVE OR CHANGE THE FOLLOWING (IT HAS TO BE AT THE END OF THE FILE) */
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app; // Export the app
