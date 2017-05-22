'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const fs = require('fs');
var gameData = [];

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
    path:'/games', 
    handler: function (request, reply) {
        //var gameStatus = getGameStatus();
        return reply(gameData);
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
    var fs = require('fs');

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});

server.on('start', generateGames);

function generateGames() {
    console.log("GENERATEGAMES");
    fs.readFile('app/json/games.json', 'utf8', function (err,data) {
      if (err) {
        return console.log("fs err: " + err);
      }

      var games = JSON.parse(data);
      var gamesObject = games.games
      gamesObject.play_log = [{'play':'3pt basket'}];

      //console.log("JSON.stringify(games): " + );
      //console.log("JSON.stringify(gamesObject): " + JSON.stringify(gamesObject));
      //console.log("gamesObject[i].home_score: " + gamesObject[i].home_score);

      for (var i = 0; i < gamesObject.length; i++) {
        gamesObject[i].home_score = 0;
        gamesObject[i].away_score = 0;
        gamesObject[i].clock_min = 0;
        gamesObject[i].clock_sec = 0;
        gamesObject[i].period = 1;
        gamesObject[i].home_play_log = [];
        gamesObject[i].away_play_log = [];
        gamesObject[i].score_diff = [];
        
        //console.log("game: " + JSON.stringify(gamesObject[i]));
        //console.log("i1: " + i);
        (function(i){
            setTimeout(function(){
                gameTick(gamesObject[i], i);
            },3000);
        }(i));
      }          

      //var timer = setTimeout(function(){
      //      console.log("i: " + i);
      //      gameTick(gamesObject);
      //  },1000);
    });
}

function gameTick (gameObj, i) {
    //console.log("gameTick: " + gameObj);
    var home_score_add = (1+randomNumber(3));
    var away_score_add = (1+randomNumber(3));
    var random_home_player = (1+randomNumber(5));
    var random_away_player = (1+randomNumber(5));
    //console.log("random player: " + gameObj.home_players["player"+random_home_player]);
    //console.log("random player: " + gameObj.away_players["player"+random_away_player]);
    
    gameObj.home_score += home_score_add;
    gameObj.away_score += away_score_add;

    console.log("Math.abs(gameObj.home_score - gameObj.away_score): " + Math.abs(gameObj.home_score - gameObj.away_score));

    var tempScoreDiff = Math.abs(gameObj.home_score - gameObj.away_score);
    if (tempScoreDiff > 8) {
        tempScoreDiff = 8;
    }

    gameObj.score_diff.push(tempScoreDiff);
    
    if (gameObj.clock_sec === 0) {
        gameObj.clock_sec = 30;
    } else {
        gameObj.clock_sec = 0;
        gameObj.clock_min += 1;
    }

    gameObj.home_play_log.push({play:gameObj.home_players["player"+random_home_player] + " " + playGenerator(home_score_add)});
    gameObj.away_play_log.push({play:gameObj.away_players["player"+random_away_player] + " " + playGenerator(away_score_add)});
    
    gameData[i] = gameObj;

    if (gameObj.clock_min < 20) {
        setTimeout(function(){
            gameTick(gameObj);
        },3000);
    } else {
        gameObj.home_score = 0;
        gameObj.away_score = 0;
        gameObj.clock_min = 0;
        gameObj.clock_sec = 0;
        gameObj.period = 1;
        gameObj.home_play_log = [];
        gameObj.away_play_log = [];
        gameObj.score_diff = [];
        setTimeout(function(){
            gameTick(gameObj);
        },3000);
    }

}

function randomNumber (numMax) {
    return Math.floor(Math.random() * numMax);
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
    return playTotal;
}
