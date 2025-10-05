const user = require("../models/User");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const {FirstName, LastName, Email, Phone,Password,Cpassword,} = req.body;
    if ( !FirstName || !LastName || !Email || !Phone || !Password || !Cpassword) {
      throw Error("Fill All The Data CareFully");
    } else {
      if (Password != Cpassword) {
        throw Error("Password Not Match");
      }
      const finduser = await user.findOne({ Email });
      if (finduser) {
        throw Error("User Already Exist");
      } else {
        const saveduser = await user.create(req.body);
        res.status(200).json(saveduser);
      }
    }
  } catch (e) {
    res.status(400).json({
      message: "issue in losignup",
      error: e.message,
    });
  }
};
// login
const login = async (req, res) => {
  try {
    console.log("Login request received:", req.body); // Debug log
    
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      console.log("Missing email or password"); // Debug log
      throw Error("Fill All The Data");
    } else {
      console.log("Looking for user with email:", Email); // Debug log
      
      const findUser = await user
        .findOne({ Email })
        .populate("DailyData")
        .populate("Activity");
        
      if (!findUser) {
        console.log("User not found"); // Debug log
        throw Error("User Does Not Exist");
      } else {
        console.log("User found, checking password"); // Debug log
        
        const IsMatch = await bcrypt.compare(Password, findUser.Password);
        if (IsMatch) {
          console.log("Password match, login successful"); // Debug log
          res.status(200).json(findUser);
        } else {
          console.log("Password mismatch"); // Debug log
          throw Error("Password Not Match");
        }
      }
    }
  } catch (e) {
    console.error("Login error:", e.message); // Debug log
    res.status(400).json({
      message: "issue in login",
      error: e.message,
    });
  }
};
module.exports = { login, signup };
