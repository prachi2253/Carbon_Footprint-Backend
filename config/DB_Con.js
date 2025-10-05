const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Mongodburl = process.env.URL;

const dbconnection = async () => {
  try {
    await mongoose.connect(Mongodburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected Successfully");
  } catch (e) {
    console.error("Error Occurred At Connecting Database:", e.message);
    console.error("Make sure MongoDB is running on:", Mongodburl);
  }
};

module.exports = dbconnection;
