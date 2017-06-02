const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.get('/character', function(req,res) {
  res.send('All The Chars')
})

app.get('/character/:name', function(req,res) {
  res.send("This Char: " + req.params('name'))
})
