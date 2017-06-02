const express = require('express');
const http = require('request-promise-native');
const ejs = require('ejs');
const app = express();

const BASE_URL = 'http://swapi.co/api/';

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.get('/characters', function(req,res) {
  var all_char = [];
  var nextUrl = BASE_URL + 'people/'
  http(nextUrl)
      .then(function (result) {
        obj.results.length = 50;
        obj.count = 50;
        nextUrl = obj.next;
        all_char.push(result);
      }).catch(function(err){
    res.send(err);
  })
  for (i = 0; i <= 4; i++) {
    http(nextUrl)
        .then(function (result) {
          nextUrl = obj.next;
          all_char.push(result);
        }).catch(function(err){
      res.send(err);
    })
  }
  console.log(JSON.parse(all_char));
})

app.get('/character/:name', function(req,res) {
  http(BASE_URL + 'people/?search=' + req.params.name)
  .then( function (result) {
    var obj = JSON.parse(result);
    res.send(ejs.render(nameView(obj)));
  }).catch(function(err){
    res.send(err);
  })
})

app.get('/planetresidents', function(req,res) {
  http(BASE_URL + 'planets/');
  .then( function(result){
    var obj = JSON.parse(result);
    res.send(obj);
  }).catch(function(err){
    res.send(err);
  })
})

app.get('/planetresidents/:page', function(req,res) {
  http(BASE_URL + 'planets/?' + req.params.page);
  .then( function(result){
    var obj = JSON.parse(result);
    res.send(obj);
  }).catch(function(err){
    res.send(err);
  })
})

function nameView(swapi_obj) {
  var res = '';

  for (var id in swapi_obj.results) {
    res +=
        "<b>Name: </b> <span>" + swapi_obj.results[id].name + "</span><br/>" +
        "<b>Height: </b> <span>" + swapi_obj.results[id].height + "</span><br/>" +
        "<b>Gender: </b> <span>" + swapi_obj.results[id].gender + "</span><br/><br/>";
  }

  return res;
}

function planetView(swapi_obj) {
  var res = '';
}