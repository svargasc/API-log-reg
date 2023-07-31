// import User from "../models/user.schema.js";
const User = require('../models/user.schema.js');
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { registerValidation, loginValidation } = require('../schemas/auth.schema.js');
const TOKEN = 'secretKey';



// Verificacion del token
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};
const accessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      TOKEN,
      {
        expiresIn: '1d',
      },
      (err, token) => {
        if(err) reject(err)
        resolve(token)
      }
    )
  })
}
const validateSchema = (schema) => (req, res, next) => {
  try {
      schema.parse(req.body);
      next();
  } catch (error) {
      return res.status(404).json({ error: error.errors.map(error => error.message) });
  }
}

// ---------------------------------------------------------
router.post("/register", validateSchema(registerValidation), async (req, res) => {

  const {name, username, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    username,
    email,
    password: passwordHash,
  });


  const saveUser = await newUser.save();
  const token = await accessToken({id: saveUser._id});
  res.cookie('token', token);

  jwt.sign({ users: newUser }, TOKEN,(err, token) => {
    if (err) {
      res.sendStatus(402);
    } else {
      res.json({
        token: token,
      });
    }
  });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

router.post("/login",validateSchema(loginValidation) ,verifyToken, async (req, res) => {

  const {username,password} = req.body;

  const userFound = await User.findOne({ username });
  if(!userFound) return res.status(400).json({ message: 'Use not found' });

  const correctPassword = await bcrypt.compare(password, userFound.password);
  if(!correctPassword) return res.status(400).json({ message: 'Password or username incorrect' });

  const token = await accessToken({id: userFound._id});
  res.cookie('token', token);

  jwt.verify(req.token, TOKEN, (error, authData) => {
    if (error) {
      res.sendStatus(403);
    } else {
      res.json({
        authData: authData,
      });
    }
  });
});

router.post('/logout', (req, res) => {
  res.cookie('token', "", {
    expires: new Date(0)
  })
  return res.sendStatus(200);
});
//Exportamos las rutas
module.exports = router;
