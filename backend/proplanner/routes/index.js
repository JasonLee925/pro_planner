var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// demo (not working)
router.get("/test", async (req, res) => {
  try{
    const [cities] = await req.db.query("SELECT * FROM Booking;");
    res.json({ error: false, cities });
  } catch (error) {
    res.json({ error: true, message: error });
  }
});

module.exports = router;

