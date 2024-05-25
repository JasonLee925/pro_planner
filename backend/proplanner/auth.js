
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY; 

const authorise = (req, res, next) => {
    const authorisation = req.headers.authorization;
    let token = null;
  
    if (authorisation && authorisation.split(" ").length === 2) {
      token = authorisation.split(" ")[1];
    }else {
      res.json({error: true, message: "no authorisation token."})
    }
  
    try {
      const decoded = jwt.verify(token, secretKey);
      if (decoded.exp < Date.now()) {
        res.json({error: true, message: "expired token"})
      } 
      next();
    } catch(err) {
      res.json({error: true, message: "token is not valid: ", err})
    }
  }


   module.exports = authorise ;