'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');

// Create a server with a host and port
// const server = new Hapi.Server();

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'app')
            }
        }
    }
});

server.connection({ 
    host: 'localhost', 
    port: 8000 
});

server.register(Inert, () => {});

// Add the route
server.route({
    method: 'GET',
    path:'/hello', 
    handler: function (request, reply) {

        return reply('hello world');
    }
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true
        }
    }
});

// Start the server
server.start((err) => {
    var fs = require('fs')

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);

    var gamesObject = {};

    generateGames();

    function gameTick (gameObj) {
        console.log("gameTick: " + gameObj);
        var home_score_add = (1+randomNumber(3));
        var away_score_add = (1+randomNumber(3));
        gameObj.home_score += home_score_add;
        gameObj.away_score += away_score_add;
        
        if (gameObj.clock_sec === 0) {
            gameObj.clock_sec = 30;
        } else {
            gameObj.clock_sec = 0;
            gameObj.clock_min += 1;
        }
        console.log("home team: " + gameObj.home_team);
        console.log("away team: " + gameObj.away_team);
        console.log("home score: " + gameObj.home_score);
        console.log("away score: " + gameObj.away_score);
        console.log("minutes: " + gameObj.clock_min);
        console.log("seconds: " + gameObj.clock_sec);
        console.log("period: " + gameObj.period);
        if (gameObj.clock_min < 20) {
            setTimeout(function(){
                    gameTick(gameObj);
                },3000);
        }
    }

    function randomNumber (numMax) {
        return Math.floor(Math.random() * numMax);
    }

    function generateGames() {
        fs.readFile('app/json/games.json', 'utf8', function (err,data) {
          if (err) {
            return console.log("fs err: " + err);
          }

          var games = JSON.parse(data);
          var gamesObject = games.games

          //console.log("JSON.stringify(games): " + );
          //console.log("JSON.stringify(gamesObject): " + JSON.stringify(gamesObject));
          //console.log("gamesObject[i].home_score: " + gamesObject[i].home_score);

          for (var i = 0; i < gamesObject.length; i++) {
            gamesObject[i].home_score = 0;
            gamesObject[i].away_score = 0;
            gamesObject[i].clock_min = 0;
            gamesObject[i].clock_sec = 0;
            gamesObject[i].period = 1;
            gamesObject[i].plays = [];
            console.log("game: " + JSON.stringify(gamesObject[i]));
            console.log("i1: " + i);
            (function(i){
                setTimeout(function(){
                    gameTick(gamesObject[i]);
                },3000);
            }(i));
          }          

          //var timer = setTimeout(function(){
          //      console.log("i: " + i);
          //      gameTick(gamesObject);
          //  },1000);
        });
    }

    function playGenerator(points) {
        var playTotal;
        if (points === 3) {
            playTotal = 'hit a 3 pt shot';
        } 
        if (points === 2) {
            playTotal = 'hit a 2 pt shot';
        }
        if (points === 1) {
            playTotal = 'hit a free throw';
        }
    }

});