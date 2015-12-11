(function () {

    var WordsModule = angular.module('WordsModule', ['ngElectron']);

    WordsModule.factory('Words', function () {
        return {
            load: function (category) {
                return [
                    { question: "tailor", result: "zuschneiden" },
                    { question: "side-load", result: "Daten zwischen zwei lokalen Geräten übertragen" },
                    { question: "in the long run", result: "auf lange Sicht" },
                    { question: "appear", result: "erscheinen" },
                    { question: "arbitration", result: "Schlichtung" },
                    { question: "patch", result: "ausbessern, flicken" },
                    { question: "energy conservation", result: "Energiespeicherung" },
                    { question: "vulnerability", result: "Schwachstelle" },
                    { question: "untenable", result: "unhaltbar" },
                    { question: "stick to", result: "sich halten an" },
                    { question: "ensure", result: "sicherstellen" },
                    { question: "selection", result: "Auswahl" },
                    { question: "core", result: "Kern" },
                    { question: "mediocre", result: "mittelmäßig" },
                    { question: "be confined to", result: "beschränkt sein auf" },
                    { question: "a dozen", result: "ein Dutzend" },
                    { question: "inure", result: "in Kraft treten, zugute kommen" },
                    { question: "consider to", result: "überlegen/erwägen, etw. zu tun" },
                    { question: "interrupt", result: "unterbrechen, Unterbrechung" },
                    { question: "consider sth.", result: "etwas beachten" },
                    { question: "scope", result: "Reichweite, Umfang" },
                    { question: "tier", result: "Schicht" },
                    { question: "rival", result: "konkurrieren mit" },
                    { question: "top-tier", result: "höchstrangig" },
                    { question: "availability", result: "Verfügbarkeit" },
                    { question: "seamless", result: "nahtlos" },
                    { question: "stay on track", result: "auf dem Laufenden bleiben" },
                    { question: "commit to", result: "sich festlegen auf" },
                    { question: "delay", result: "Verzögerung" },
                    { question: "dedicated", result: "(als etw.) ausgezeichnet, vorgesehen" },
                    { question: "appointment", result: "Termin" },
                    { question: "well-rounded", result: "wohlgerundet, vielseitig" },
                    { question: "approve", result: "genehmigen, erlauben" },
                    { question: "enhance", result: "erweitern, erhöhen" },
                    { question: "convenient", result: "praktisch, geeignet, bequem" },
                    { question: "comprehensive", result: "umfassend" },
                    { question: "exceed", result: "übersteigen" },
                    { question: "decisive", result: "entscheidend" },
                    { question: "beneficial", result: "vorteilhaft" },
                    { question: "achieve", result: "erreichen" },
                    { question: "unique", result: "einzigartig" },
                    { question: "orientation", result: "Neigung" },
                    { question: "at max", result: "höchstens" },
                    { question: "sparingly", result: "sparsam (adv.)" },
                    { question: "economic", result: "sparsam (adj.)" },
                    { question: "gradation", result: "Abstufung" },
                    { question: "gradual", result: "allmählich, schrittweise" },
                    { question: "hue", result: "Farbton" },
                    { question: "pose", result: "darstellen" },
                    { question: "distraction", result: "Ablenkung" },
                    { question: "emphasis", result: "Betonung" },
                    { question: "consistently", result: "beständig, durchgehend, konsequent" },
                    { question: "reassurance", result: "Beruhigung, Beschwichtigung" },
                    { question: "distribution", result: "Verteilung" },
                    { question: "figure", result: "(Fig.) Abbildung" },
                    { question: "omit", result: "auslassen, weglassen" },
                    { question: "auxiliary", result: "Hilfs..." },
                    { question: "compiled", result: "zusammengestellt" },
                    { question: "belong together", result: "zusammengehören" },
                    { question: "reinforcement", result: "Verstärkung" },
                    { question: "meet a requirement", result: "eine Voraussetzung erfüllen" },
                    { question: "project", result: "projizieren" },
                    { question: "underestimate", result: "unterschätzen" },
                    { question: "snap point", result: "Rasterpunkt" },
                    { question: "rectangular", result: "rechteckig" },
                    { question: "regard", result: "beachten" },
                    { question: "as few as", result: "so wenig wie" },
                    { question: "arbitrarily", result: "willkürlich" },
                    { question: "extend", result: "erweitern" },
                    { question: "precede", result: "Vorrang haben" },
                    { question: "to be tasked", result: "den Auftrag haben" },
                    { question: "turnaround time", result: "Laufzeit" },
                    { question: "to realize", result: "sich klar werden" },
                    { question: "to gather", result: "sammeln" },
                    { question: "allotted", result: "zugewiesen, vorgesehen" },
                    { question: "apparent", result: "offensichtlich" },
                    { question: "retrieve", result: "abrufen" },
                    { question: "spreadsheet", result: "(Excel-)Tabelle" },
                    { question: "sufficient", result: "ausreichend" },
                    { question: "to decline", result: "sich verringern" },
                    { question: "issue", result: "Problem" },
                    { question: "prone to", result: "anfällig für" },
                    { question: "time-consuming", result: "zeitintensiv" },
                    { question: "contradictory", result: "widersprüchlich" },
                    { question: "erroneous", result: "fehlerhaft" }
                ];
            }
        };
    });

    WordsModule.controller('WordsController', function ($scope, $rootScope, electron, Words) {

        var me = this,
            random = function getRandomNumber(max) { return Math.floor(Math.random() * max); };

        $scope.vocables = Words.load('English');

        $scope.card = {};

        $scope.showResult = false;

        $scope.possibles = [];

        $scope.canAnswer = true;

        $scope.score = { fails: 0, wins: 0, viewed: 0 };

        $scope.getResult = function () {
            $scope.showResult = !$scope.showResult;
            $scope.canAnswer = false;
            $scope.score.fails++;
            $scope.score.viewed++;
        };

        $scope.shufflePossibilities = function() {
            $scope.possibles = [];
            var idxs = [];
            while ($scope.possibles.length < 4) {
                var idx = random($scope.vocables.length);
                var item = $scope.vocables[idx];
                if (item.result !== $scope.card.result && idxs.indexOf(idx) < 0) {
                    idxs.push(idx);
                    $scope.possibles.push(item);
                }
            }

            $scope.possibles[random(4)] = $scope.card;
        };

        $scope.showCard = function () {
            $scope.showResult = false;
            $scope.canAnswer = true;
            $scope.index = random($scope.vocables.length);
            $scope.card = $scope.vocables[$scope.index];
            $scope.shufflePossibilities();
        };

        $scope.selectOption = function (idx) {
            $scope.canAnswer = false;
            if ($scope.possibles[idx].result === $scope.card.result) {
                $scope.score.wins++;
                $scope.showCard();
            } else {
                $scope.score.fails++;
            }
        };

        // debugger;
        $scope.showCard();

    });

})();
