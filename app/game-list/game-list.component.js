'use strict';

// Register `gameList` component, along with its associated controller and template
angular.
  module('gameList').
  component('gameList', {
    templateUrl: 'game-list/game-list.template.html',
    controller: ['$http', function GameListController($http) {
      var self = this;
      //self.orderProp = 'age';

      $http.get('json/games.json').then(function(response) {

        var _score_home = document.querySelectorAll('.score_0.home-digits');
        var _score_away = document.querySelectorAll('.score_0.away-digits');

        console.log("score_home[0]: " + _score_home[0]);

        self.games = response.data.games;
        //console.log("self.games: " + JSON.stringify(self.games));
        console.log("self.games: " + self.games.length);
      });

      function setNumber(digit, number) {
        var digitSegments = [
          [1,2,3,4,5,6],
          [2,3],
          [1,2,7,5,4],
          [1,2,7,3,4],
          [6,7,2,3],
          [1,6,7,3,4],
          [1,6,5,4,3,7],
          [1,2,3], 
          [1,2,3,4,5,6,7],
          [1,2,7,3,6]
        ];
        var segments = digit.querySelectorAll('.segment');
        var current = parseInt(digit.getAttribute('data-value'));

        // only switch if number has changed or wasn't set
        if (!isNaN(current) && current != number) {
          // unset previous number
          digitSegments[current].forEach(function(digitSegment, index) {
            setTimeout(function() {
              segments[digitSegment-1].classList.remove('on');
            }, index*45)
          });
        }
        
        if (isNaN(current) || current != number) {
          // set new number after
          setTimeout(function() {
            digitSegments[number].forEach(function(digitSegment, index) {
              setTimeout(function() {
                segments[digitSegment-1].classList.add('on');
              }, index*45)
            });
          }, 250);
          digit.setAttribute('data-value', number);
        }
      }
    }]
  });
