const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require ('bcryptjs')

dotenv.config();

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

connectToDatabase();

const jwtSecret = process.env.JWT_SECRET;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));



app.get('/test', (req, res) => {
    res.json('test ok');
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) throw err;
        res.json(userData);
      });
    } else {
      res.status(401).json('no token');
    }
  });
  
app.post('/login', async (req,res)=>{
const{username,password} = req.body;
const doundUser = await User.findOne({username});


});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const createdUser = await User.create({ username, password });
        jwt.sign({ userID: createdUser._id ,username}, jwtSecret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token,{sameSite:'none',secure:true}).status(201).json({ id: createdUser._id, });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json('error');
    }
});

app.listen(4040, () => {
    console.log('Server is running on port 4040');
});
