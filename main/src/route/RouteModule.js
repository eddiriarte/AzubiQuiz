(function () {
    var RouteModule = angular.module('RouteModule', []);

    RouteModule.config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: "src/main/main.html",
                controller: 'MainController'
            })
            .when('/words', {
                templateUrl: "src/words/words.html",
                controller: 'WordsController'
            })
            .when('/choices', {
                templateUrl: "src/choices/choices.html",
                controller: 'ChoicesController'
            })
            .otherwise('/');
    }]);
})();
