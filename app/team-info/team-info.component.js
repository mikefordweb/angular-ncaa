'use strict';

// Register `gameList` component, along with its associated controller and template
angular.
  module('teamInfo').
  component('teamInfo', {
    templateUrl: 'team-info/team-info.template.html',
    bindings: {
      teamType: '='
    },
    controller: ['$http', function TeamInfoController($http) {
      var self = this;
      console.log("in TeamInfoController");
      console.log("teamType: " + this.teamType);
      //self.orderProp = 'age';

      /*$http.get('json/games.json').then(function(response) {
        self.games = response.data.games;
        console.log("self.games: " + JSON.stringify(self.games));
        console.log("self.games: " + self.games.length);
      });*/
    }]
  });
