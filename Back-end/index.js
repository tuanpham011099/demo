const express = require("express");
const user = require("./routers/user");
const course = require("./routers/course");
const admin = require("./routers/admin");
const registration = require("./routers/registration");
const app = express();
require('dotenv').config();
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/users", user);
app.use("/classes", course);
app.use("/admins", admin);
app.use("/registrations", registration);
app.use("*", (req, res) => {
    res.status(404).json({ msg: "Route not found" });
});

module.exports = app;