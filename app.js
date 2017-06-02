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

  var calls = [
    http('http://swapi.co/api/people/?page=1'),
    http('http://swapi.co/api/people/?page=2'),
    http('http://swapi.co/api/people/?page=3'),
    http('http://swapi.co/api/people/?page=4'),
    http('http://swapi.co/api/people/?page=5')
  ];

  Promise.all(calls)
      .then(
          function (results) {
            var all = [];
            var sortBy = req.params['id'];
            console.log('results: ', results);
            for (var i in results) {
              var obj = JSON.parse(results[i]);
              all = all.concat(obj.results);
            }

            all.sort(function (a,b) {
              if(isNaN(a[sortBy])) {
                return a[sortBy].localeCompare(b[sortBy]);
              } else {
                return a[sortBy] - b[sortBy];
              }
            });

            res.send(all);
          }
      )
  ;
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
  http(BASE_URL + 'planets/')
  .then( function(result){
    var obj = JSON.parse(result);
    res.send(ejs.render(planetView(obj)));
  }).catch(function(err){
    res.send(err);
  })
})

app.get('/planetresidents/:page', function(req,res) {
  http(BASE_URL + 'planets/?' + req.params.page)
  .then( function(result){
    var obj = JSON.parse(result);
    res.send(ejs.render(planetView(obj)));
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
  var planetJSON = buildPlantView(swapi_obj);
  return planetJSON;
}


function buildPlantView(swapi_obj) {
  var res = [];
  for (var id in swapi_obj.results) {
    res[swapi_obj.results[id].name] = [];
     for (var url in swapi_obj.results.residents) {
       res[swapi_obj.results[id].name].push(getPersonName(url));
     }
  }
}

function getPersonName(url){
  http(url)
      .then( function(result){
        return  result.name
      })
}