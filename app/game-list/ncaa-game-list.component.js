'use strict';

// Register `gameList` component, along with its associated controller and template
angular.
  module('ncaaGameList').
  component('ncaaGameList', {
    templateUrl: 'game-list/ncaa-game-list.template.html',
    controller: ['$scope', '$http', '$interval', function NcaaGameListController($scope, $http, $interval) {
      var self = this;

      self.gameProp = 'gameslist';

      var loadData = function() {
        $http.get('/games').then(function(response) {
          //console.log("response.data: " + JSON.stringify(response.data));
          self.games = response.data;
        });
      };

      $scope.showingplays = '';
      $scope.showplaysclass = '';

      loadData();

      //var gameUpdate = $interval(loadData,5000);

      $scope.showPlays = function($event) {
        //console.log($event.target);
        $($event.currentTarget).parent().addClass('game-plays-open');
        //$scope.showplaysclass = 'game-plays-open';
        //$scope.showingplays = 'showing-plays';
      }

    }]
  }).directive('mySegment', function() {
    function link(scope, element, attrs) {
      //console.log(attrs);
      var firstDigit = 0;
      var secondDigit = 0;

      //console.log("element.parent().data('current-digit'): " + element.parent().data('current-digit'));

      if (element.parent().data('digit') === 1) {
        if (element.parent().data('team') === 'home') {
            if (scope.gameData.home_score.toString().length > 1) {
              firstDigit = scope.gameData.home_score.toString().charAt(0);
              secondDigit = scope.gameData.home_score.toString().charAt(1);
            } else {
              firstDigit = 0;
              secondDigit = scope.gameData.home_score.toString().charAt(0);
            }
          //console.log("data-current-digit: " + element.parent().data('current-digit'));
          setNumber(element, firstDigit, element.parent().data('current-digit'));
          //element.html(setNumber(scope.gameData.home_score.toString().charAt(0)));
        } else {
          if (scope.gameData.away_score.toString().length > 1) {
            firstDigit = scope.gameData.away_score.toString().charAt(0);
            secondDigit = scope.gameData.away_score.toString().charAt(1);
          } else {
            firstDigit = 0;
            secondDigit = scope.gameData.away_score.toString().charAt(0);
          }
          //console.log("data-current-digit: " + element.parent().data('current-digit'));
          setNumber(element, firstDigit, element.parent().data('current-digit'));
          //element.html(setNumber(scope.gameData.away_score.toString().charAt(0)));
        }
      } else {
        if (element.parent().data('team') === 'home') {
          //console.log("data-current-digit: " + element.parent().data('current-digit'));
          if (scope.gameData.home_score.toString().length > 1) {
              firstDigit = scope.gameData.home_score.toString().charAt(0);
              secondDigit = scope.gameData.home_score.toString().charAt(1);
            } else {
              firstDigit = 0;
              secondDigit = scope.gameData.home_score.toString().charAt(0);
            }
          setNumber(element, secondDigit, element.parent().data('current-digit'));
          //element.html(setNumber(scope.gameData.home_score.toString().charAt(1)));
        } else {
          //console.log("data-current-digit: " + element.parent().data('current-digit'));
          if (scope.gameData.away_score.toString().length > 1) {
            firstDigit = scope.gameData.away_score.toString().charAt(0);
            secondDigit = scope.gameData.away_score.toString().charAt(1);
          } else {
            firstDigit = 0;
            secondDigit = scope.gameData.away_score.toString().charAt(0);
          }
          setNumber(element, secondDigit, element.parent().data('current-digit'));
          //element.html(setNumber(scope.gameData.away_score.toString().charAt(1)));
        }
      }

      function setNumber(element, number, currentDigit) {
          //console.log("number: " + number);
          //console.log("currentDigit: " + currentDigit);
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

          var templateSegments = ['','','','','','',''];

          digitSegments[number].forEach(function(digitSegment, index) {
              templateSegments[digitSegment-1] = '<div class="segment on"></div>';
          });

          templateSegments.forEach(function(tempSegment, index) {
            if (tempSegment === '') {
              templateSegments[index] = '<div class="segment"></div>';
            }
          });

          element.parent().data('current-digit','8');

          templateSegments.forEach(function(tempSegment, index) {
            setTimeout(function(){
              element.append(tempSegment);
            }, index*45)
          });
          //return templateSegments.join(' ');
        }

/////
/*
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
/////
*/

    }
    return {
      scope: {
        gameData: '=gameinfo'
      },
      controllerAs: 'vm',
      link: link,
      replace: 'true',
      controller: function($scope) {
        var vm = this;

        vm.segmentStr = '';
        vm.templateString = '';
      }
    }
  }).directive('gameClock', function() {
    function link(scope, element, attrs) {
      var gameClockString = '';
      
      if (scope.gameData.clock_min.toString().length === 1) {
        gameClockString = "0" + scope.gameData.clock_min.toString();
      } else {
        gameClockString = scope.gameData.clock_min.toString();
      }

      if (scope.gameData.clock_sec.toString().length === 1) {
        gameClockString = gameClockString.toString() + ":0" + scope.gameData.clock_sec.toString();
      } else {
        gameClockString = gameClockString.toString() + ":" + scope.gameData.clock_sec.toString();
      }

      element.html(gameClockString);
    }
    return {
      scope: {
        gameData: '=gameinfo'
      },
      controllerAs: 'vm',
      link: link,
      replace: 'true',
      controller: function($scope) {
        var vm = this;
      }
    }
  }).directive('gameTracker', function() { 
    function link(scope, element, attrs) {
      var gameTrackerHTML = '';
      var scoreSections = scope.gameData.score_diff;
      for (var i=0; i<scoreSections.length; i++) {
        gameTrackerHTML += '<div class="graph-column">';
        //console.log("scoreSections[i]: " + scoreSections[i]);
        if (scoreSections[i] === 0) {
          gameTrackerHTML += '<div class="empty-bar"></div>';
        }
        for (var j=0; j<scoreSections[i]; j++) {
          gameTrackerHTML += '<div class="graph-bar"></div>';
        }
        gameTrackerHTML += '</div>';
      }
      element.html(gameTrackerHTML);
    }
    return {
      scope: {
        gameData: '=gameinfo'
      },
      controllerAs: 'vm',
      link: link,
      replace: 'true',
      controller: function($scope) {
        var vm = this;
      }
    }
  }).directive('showPlays', function() {
  return {
    restrict: 'AE',
    link: function(scope, elem, attrs) {
      elem.find('.game-play-button').on('click', function() {
        console.log("game play click");
        $(this).parent().find('.game-plays').addClass('game-plays-open');
        $(this).parent().parent().parent().parent().addClass('showing-plays');
      });
    }
  };
}).directive('updateGames', function($interval, $http, $timeout) {
  return {
    restrict: 'AE',
    link: function(scope, elem, attrs) {
      
      var updateData = function() {
        console.log("updateData");
        $http.get('/games').then(function(response) {
          //console.log("response.data: " + JSON.stringify(response.data));
          //self.games = response.data;
          var games = response.data;

          //console.log("elem.find('.container').data('game-id'): " + elem.find('.container').data('game-id'));

          //console.log("games.length: " + games.length);

          for (var i = 0; i < games.length; i++) {
            //console.log("games[i].game_id: " + games[i].game_id);
            //console.log("elem.find('.container').data('game-id'): " + elem.find('.container').data('game-id'));
            if (games[i].game_id == elem.find('.container').data('game-id')) {
              var currentGameElem = elem.find('.container[data-game-id="'+games[i].game_id+'"]');

              var homeFirstDigitsSegmentsElem = elem.find('.digit.home-digits[data-digit="1"]').find('.segments');
              var homeSecondDigitsSegmentsElem = elem.find('.digit.home-digits[data-digit="2"]').find('.segments');
              var awayFirstDigitsSegmentsElem = elem.find('.digit.away-digits[data-digit="1"]').find('.segments');
              var awaySecondDigitsSegmentsElem = elem.find('.digit.away-digits[data-digit="2"]').find('.segments');

              //homeFirstDigitsSegmentsElem.html('');
              //homeSecondDigitsSegmentsElem.html('');
              //awayFirstDigitsSegmentsElem.html('');
              //awaySecondDigitsSegmentsElem.html('');
              if (games[i].home_score.toString().length < 2) {
                var homeFirstDigit = 0;
                var homeSecondDigit = games[i].home_score.toString().charAt(0);
              } else {
                var homeFirstDigit = games[i].home_score.toString().charAt(0);
                var homeSecondDigit = games[i].home_score.toString().charAt(1);
              }

              if (games[i].away_score.toString().length < 2) {
                var awayFirstDigit = 0;
                var awaySecondDigit = games[i].away_score.toString().charAt(0);
              } else {
                var awayFirstDigit = games[i].away_score.toString().charAt(0);
                var awaySecondDigit = games[i].away_score.toString().charAt(1);
              }

              var prevHomeFirstDigit = elem.find('.digit.home-digits[data-digit="1"]');
              var prevHomeSecondDigit = elem.find('.digit.home-digits[data-digit="2"]');

              var prevAwayFirstDigit = elem.find('.digit.away-digits[data-digit="1"]');
              var prevAwaySecondDigit = elem.find('.digit.away-digits[data-digit="2"]');

              setNumber(homeFirstDigitsSegmentsElem, homeFirstDigit, prevHomeFirstDigit);
              setNumber(homeSecondDigitsSegmentsElem, homeSecondDigit, prevHomeSecondDigit);

              setNumber(awayFirstDigitsSegmentsElem, awayFirstDigit, prevAwayFirstDigit);
              setNumber(awaySecondDigitsSegmentsElem, awaySecondDigit, prevAwaySecondDigit);
            }
          }

          function setNumber(element, number, currentDigit) {
              
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

              var templateSegmentsPrevNum = ['','','','','','',''];
              var templateSegments = ['','','','','','',''];

              /*****

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

              *****/

              element.find('.segment').each(function(segment, index) {
                $(this).removeClass('on');
              });

              digitSegments[number].forEach(function(digitSegment, index) {
                  //templateSegments[digitSegment-1] = '<div class="segment on"></div>';
                  setTimeout(function(){
                    element.find('.segment:eq('+(digitSegment-1)+')').addClass('on');
                  }, index*45)
              });

              /*templateSegments.forEach(function(tempSegment, index) {
                if (tempSegment === '') {
                  templateSegments[index] = '<div class="segment"></div>';
                }
              });

              element.parent().data('current-digit',number);

              //console.log("templateSegments: " + templateSegments.length);

              templateSegmentsPrevNum.forEach(function(tempSegment, index) {
                setTimeout(function(){
                  //console.log("tempSegment: " + tempSegment);
                  element.append(tempSegment);
                }, index*45)
              });

              templateSegments.forEach(function(tempSegment, index) {
                setTimeout(function(){
                  //console.log("tempSegment: " + tempSegment);
                  element.append(tempSegment);
                }, index*45)
              });*/

            }
        });
      };

      updateData();
      var gameUpdate = $interval(updateData,5000);

    }
  };
});



