// Import express
const express = require("express");
//Import a body parser module to be able to access the request body as json
const bodyParser = require("body-parser");

//Use cors to avoid issues with testing on localhost
const cors = require("cors");

const app = express();

const apiPath = "/api/";
const version = "v1";
const basePath = `${apiPath}${version}`;
const port = 3000;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express to use cors -- enables CORS for this backend
app.use(cors());

//Set Cors-related headers to prevent blocking of local requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// In-memory storage for simplicity
let events = [
  {
    id: 1,
    name: "Tech Conference 2024",
    date: "2024-05-15",
    location: "Convention Center, Techville",
  },
  {
    id: 2,
    name: "Art & Design Workshop",
    date: "2024-06-20",
    location: "Downtown Art Studio, Creativetown",
  },
  {
    id: 3,
    name: "Sustainability Summit",
    date: "2024-07-05",
    location: "Green Park, Eco City",
  },
];
let attendees = [
  {
    id: 1,
    eventId: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
  },
  {
    id: 2,
    eventId: 1,
    name: "Samantha Davis",
    email: "samantha.davis@example.com",
  },
  { id: 3, eventId: 2, name: "James Smith", email: "james.smith@example.com" },
  {
    id: 4,
    eventId: 2,
    name: "Emily Miller",
    email: "emily.miller@example.com",
  },
  {
    id: 5,
    eventId: 3,
    name: "Jessica Taylor",
    email: "jessica.taylor@example.com",
  },
];

// Our id counters
// We use basic integer ids here, but other solutions (such as UUIDs) would be better
let nextEventId = 4;
let nextAttendeeId = 6;

// Routes for Events
app.get(`${basePath}/events`, (req, res) => {
  res.json(events);
});

app.post(`${basePath}/events`, (req, res) => {
  const { name, date, location } = req.body;

  if (!name || !date || !location) {
    return res.status(400).json({
      message:
        "Missing required field(s). Name, date, and location are required.",
    });
  }

  const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateFormat.test(date)) {
    return res
      .status(400)
      .json({ message: "Invalid date format. Use YYYY-MM-DD." });
  }
  const event = { id: nextEventId, name, date, location };
  events.push(event);
  nextEventId++;
  res.status(201).json(event);
});

app.get(`${basePath}/events/:eventId`, (req, res) => {
  const event = events.find((e) => e.id === parseInt(req.params.eventId));
  if (!event) return res.status(404).send("Event not found");
  res.send(event);
});

app.get(`${basePath}/events/:eventId/attendees`, (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const event = events.find((e) => e.id === eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  const eventAttendees = attendees.filter((a) => a.eventId === eventId);

  res.json(eventAttendees);
});

app.post(`${basePath}/events/:eventId/attendees`, (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const event = events.find((e) => e.id === eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({
      message: "Missing required attendee details: name and/or email.",
    });
  }

  const attendee = { id: nextAttendeeId, eventId, name, email };
  attendees.push(attendee);
  nextAttendeeId++;
  res.status(201).json(attendee);
});

app.get(apiPath + version + "/reset", (req, res) => {
  events = [
    {
      id: 1,
      name: "Tech Conference 2024",
      date: "2024-05-15",
      location: "Convention Center, Techville",
    },
    {
      id: 2,
      name: "Art & Design Workshop",
      date: "2024-06-20",
      location: "Downtown Art Studio, Creativetown",
    },
    {
      id: 3,
      name: "Sustainability Summit",
      date: "2024-07-05",
      location: "Green Park, Eco City",
    },
  ];
  attendees = [
    {
      id: 1,
      eventId: 1,
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
    },
    {
      id: 2,
      eventId: 1,
      name: "Samantha Davis",
      email: "samantha.davis@example.com",
    },
    {
      id: 3,
      eventId: 2,
      name: "James Smith",
      email: "james.smith@example.com",
    },
    {
      id: 4,
      eventId: 2,
      name: "Emily Miller",
      email: "emily.miller@example.com",
    },
    {
      id: 5,
      eventId: 3,
      name: "Jessica Taylor",
      email: "jessica.taylor@example.com",
    },
  ];

  nextEventId = 4;
  nextAttendeeId = 6;

  return res.status(200).json({ message: "State reset successful." });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app; // Export the app
