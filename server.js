const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const port = 3020;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For JSON parsing
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/students")
  .then(() => console.log("MongoDB connection established successfully."))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));


const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("MongoDB connection established successfully.");
});

// Schema and Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  age: Number,
  gender: String,
  from: String,
  where: String,
  timeSlot: String,
});

const users = mongoose.model("data", UserSchema);

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/post", async (req, res) => {
  try {
    console.log(req.body); // Log the data to check if it's being received
    const { name, email, phone, age, gender, from, where, timeSlot } = req.body;
    const user = new users({ name, email, phone, age, gender, from, where, timeSlot });
    await user.save();
    res.status(201).send("Data saved successfully!");
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Internal Server Error.");
  }
});


app.get("/home", (req, res) => {
  res.send("<h1>Welcome to the home page</h1>");
});

app.get("/about", (req, res) => {
  res.send("<h1>About Us</h1>");
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
