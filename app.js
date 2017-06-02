const express = require('express');
const http = require('request-promise-native');
const ejs = require('ejs');
const app = express();

const BASE_URL = 'http://swapi.co/api/';

app.set('view engine', 'ejs');

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

  var sortBy = req.query['sort'];

  if (!sortBy) {
    sortBy = 'name';
  }

  Promise.all(calls)
      .then(
          function (results) {
            var all = [];
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
      var data = nameView(obj);
      res.render('character', {attr: data});
  }).catch(function(err){
    res.send(err);
  })
})

app.get('/planetresidents', function(req,res) {
  var page = req.query['page'];
  if (!page) {
    page = 1;
  }
  http(BASE_URL + 'planets/?page=' + page)
  .then( function(result){
    var planetList = JSON.parse(result);

    var ret = {};

    var calls = [];
    var planetUrlMap =  {};
    for (var i in planetList.results) {
      ret[planetList.results[i].name] = [];
      planetUrlMap[planetList.results[i].url] = planetList.results[i].name;
      for (var j in planetList.results[i].residents) {
        calls.push(http(planetList.results[i].residents[j]));
      }
    }
    Promise.all(calls)
        .then(
            function(peopleResults) {
              for (var i in peopleResults) {
                var personResult = JSON.parse(peopleResults[i]);
                ret[planetUrlMap[personResult.homeworld]].push(personResult.name);
              }
              res.send(ret);
            }
        )
        .catch(
            function(err) {
              res.send(err);
            }
        )
    ;
  }).catch(function(err){
    res.send(err);
  })
});

function nameView(swapi_obj) {
  var res = [];
  for (var id in swapi_obj.results) {
      if(!res[id]) res[id] = {};
      res[id]['Name'] = swapi_obj.results[id].name;
      res[id]['Height'] = swapi_obj.results[id].height;
      res[id]['Gender'] = swapi_obj.results[id].gender;

  }
  console.log(res);
  return res;
}