(function () {

    var ChoicesModule = angular.module('ChoicesModule', ['ngElectron']);

    ChoicesModule.factory('MultipleChoice', function (JSONFile) {
        return {
            load: function function_name(category) {
                return JSONFile.read('choices_bp-2016.json');
            }
        };
    });

    ChoicesModule.controller('ChoicesController', function ($rootScope, $scope, Random, MultipleChoice) {

        $scope.questions = [];

        $scope.answer = [];

        $scope.card = {};

        $scope.canAnswer = true;

        $scope.score = { fails: 0, wins: 0, viewed: 0 };

        $scope.updateScore = function (result) {
            if (result === true){
                $scope.score.wins++;
            } else {
                $scope.score.fails++;
            }
        };

        $scope.getResult = function () {
            angular.forEach($scope.card.options, function (item, idx) {
                var isExpected = typeof item.result === 'boolean',
                    expectation = (isExpected) ? item.result : false,
                    hasAnswer = typeof $scope.answer[idx] === 'boolean',
                    answer = (hasAnswer) ? $scope.answer[idx] : false;
                if (isExpected || hasAnswer) {
                    item.correct = (expectation === answer);
                    item.wrong = !item.correct;
                    $scope.updateScore(item.correct);
                }
            });
            $scope.canAnswer = false;
        };

        $scope.shuffleCard = function () {
            $scope.card = {},
            $scope.canAnswer = true;
            $scope.answer = [];
            $scope.index = Random.index($scope.questions.length);
            $scope.card = angular.copy($scope.questions[$scope.index]);
        };

        MultipleChoice
            .load('bp')
            .then(function (data) {
                $scope.questions = data;
                $scope.shuffleCard();
            }, function (err) {
                console.error(err);
            })

    });
})();
