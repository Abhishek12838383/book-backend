const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./User/User");

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect("mongodb://127.0.0.1:27017/Book")
.then(()=>console.log("mongo db connected"))
.catch((err)=>console.log(err));


// signup
app.post("/signin", async(req,res)=>{
    const{email,password} = req.body;
    try {
        const hash = await bcrypt.hash(password,10);
        const user = new User({email,password:hash});
        await user.save();
        res.json({message:"User registered successfully"});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }

});


// login
app.post("/loginn", async(req,res)=>{
    const{email,password} = req.body;
    const user = await User.findOne({email});

    if (!user) return res.status(400).json({ message: "User not found" });

    
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, "MY_SECRET_KEY", { expiresIn: "5h" });
  res.json({ message: "Login successful", token });


})

app.listen("5000",()=>{
    console.log("Server is running on port 5000");
})