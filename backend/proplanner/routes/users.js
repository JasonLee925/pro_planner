var express = require('express');
var router = express.Router();
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authorise = require('./auth')

const secretKey = process.env.SECRET_KEY; 

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Example operations
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Create User Account 
 *     description: Create a user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 */
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
    const result = await req.db.from("users").insert({ email, hash });

    res.status(201).json({ id: result[0] });
}) 

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User Login
 *     description: user login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 */
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

  const queryUsers = await req.db.from("users").select("*").where("email", "=", email)

  if(queryUsers.length == 0){
    return res.status(401).json({error: true, message:"user does not exist"});
  }

  const user = queryUsers[0];
  const match = await bcrypt.compare(password, user.hash);
  if (!match) {
    return res.status(401).json({error:true, message: "password does not match"})
  }
    
  const expires_in = 60*60*24;
  const userId = user.id;
  const exp = Date.now() + expires_in * 1000;
  const token = jwt.sign({userId, email, exp}, secretKey); 

  res.json({token_type: "Bearer", token, expires_in})
})


/**
 * @swagger
 * /:
 *   delete:
 *     summary: Delete User Account 
 *     description: Delete a user account.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful response
 */
router.delete("/", authorise, async(req, res) => {
  const user_id = req.token.userId;
  if (user_id === null) {
      return res.status(400).json({error: true, message: "invalid token: user id not found"})
  }

  const tx = await req.db.transaction();

  try {
    let result = await tx('matrixes').select("id").where("user_id", "=", user_id)
    const ownedMatrixes = result.map(x => x.id)

    result = await tx('matrix_details').where("id", "in", ownedMatrixes).del();

    result = await tx('matrixes').where("id", "in", ownedMatrixes).del();

    result = await tx('users').where("id", "=", user_id).del();

    await tx.commit();
    res.json();
  } catch (error) {
    await tx.rollback();
    res.status(500).json({error:true, message: error})
  } 

}) 

/**
 * @swagger
 * /varifyToken:
 *   get:
 *     summary: Varify Token
 *     description: Varify token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/varifyToken", authorise, (req, res) => {
  res.json({valid: true})
})

module.exports = router;
