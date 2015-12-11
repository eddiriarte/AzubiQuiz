(function () {

    /**
     * Call all App dependencies and Modules.
     */
    var app = angular.module('app', [
        "ngElectron",
        "ngAnimate",
        "ngAria",
        "ngMaterial",
        "ngRoute",
        'RouteModule',
        'MainModule',
        'WordsModule',
        'ChoicesModule'
    ]);

    app.factory('JSONFile', function (electron, $rootScope, $q) {

        var me = this,
            baseDir = electron.app.getPath('userDesktop') + '/learning/';

        me.parseQuestions = function (data) {
            var qPattern = /(^[\w\däöüÄÖÜ,: \.]+):\s+\- ([\w\däöüÄÖÜ,: \(\)\.]+)\s+\- ([\w\däöüÄÖÜ,; \(\)\.]+)\s+\- ([\w\däöüÄÖÜ,: \(\)\.]+)\s+\- ([\w\däöüÄÖÜ,: \(\)\.]+)/,
                qTarget = '{ "question": "$1", "options": [ { "text": "$2" }, { "text": "$3" }, { "text": "$4" }, { "text": "$5" } ] },',
                rPattern = / \(true\)"/,
                rTarget = '", "target": true',
                newData = data.toString();
            newData = newData.replace(qPattern, qTarget);
            newData = newData.replace(rPattern, rTarget);
            newData = '[' + newData + ']';
            return newData;
        };

        return {
            // choices_BP-2016.txt
            read: function (file) {
                var deferred = $q.defer();
                electron.fs.readFile(baseDir + file, function(error, data) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        var data = JSON.parse(data);
                        deferred.resolve(data);
                    }
                });
                return deferred.promise;
            },
            write: function (file, data) {
                var deferred = $q.defer();
                electron.fs.writeFile(baseDir + file, JSON.stringify(data), function(error) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        deferred.resolve(true);
                    }
                });
                return deferred.promise;
            }
        };
    });

})();
