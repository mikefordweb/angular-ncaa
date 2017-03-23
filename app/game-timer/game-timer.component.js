'use strict';

// Register `gameList` component, along with its associated controller and template
angular.
  module('gameTimer').
  component('gameTimer', {
    templateUrl: 'game-timer/game-timer.template.html',
    controller: ['$http', function GameTimerController($http) {
      var self = this;
      console.log("in GameTimerController");
      //self.orderProp = 'age';

      /*$http.get('json/games.json').then(function(response) {
        self.games = response.data.games;
        console.log("self.games: " + JSON.stringify(self.games));
        console.log("self.games: " + self.games.length);
      });*/
    }]
  });
