var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authorise = require('../auth')

const secretKey = process.env.SECRET_KEY; 

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/register", async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const users = await req.db.from("users").select("*").where("email", "=", email);

    if (users.length > 0) {
      return res.status(400).json({
        error: true,
        message: "user already exists"
      });
    }

    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    req.db.from("users").insert({ email, hash });

    res.status(201).json({ error: false, message: "user created" });
}) 

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json({
      error:true,
      message: "Resquest body is incomplete"
    });

    return;
  }

  const queryUsers = await req.db.from("users").select("email", "hash").where("email", "=", email)

  if(queryUsers.length == 0){
    return res.status(401).json({error: false, message:"user does not exist"});
  }

  const user = queryUsers[0];
  const match = await bcrypt.compare(password, user.hash);
  if (!match) {
    return res.status(401).json({error:true, message: "password do not match"})
  }
    
  const expires_in = 60*60*24;

  const exp = Date.now() + expires_in * 1000;
  const token = jwt.sign({email, exp}, secretKey); 

  res.json({token_type: "Bearer", token, expires_in})
})

 
router.post("/city", authorise, (req, res) => {
  res.json({soSomething: true})
})

module.exports = router;
