

var Q = require('q');
var childProcess = require('child_process');
var asar = require('asar');
var jetpack = require('fs-jetpack');
var projectDir;
var buildDir;
var manifest;
var appDir;

function init() {
    projectDir = jetpack;
    buildDir = projectDir.dir('./dist', { empty: true });
    appDir = projectDir.dir('./build');
    manifest = appDir.read('./package.json', 'json');

    return Q();
}

function copyElectron() {
    return projectDir.copyAsync('./node_modules/electron-prebuilt/dist',
        buildDir.path(),
        { overwrite: true });
}

function cleanupRuntime() {
    return buildDir.removeAsync('resources/default_app');
}

function createAsar() {
    var deferred = Q.defer();
    asar.createPackage(appDir.path(),
        buildDir.path('resources/app.asar'),
        function () {
            deferred.resolve();
        });

    return deferred.promise;
}

function updateResources() {
    var deferred = Q.defer();

    projectDir.copy('icon.ico', buildDir.path('icon.ico'));

    var rcedit = require('rcedit');
    rcedit(buildDir.path('electron.exe'), {
        'icon': projectDir.path('icon.ico'),
        'version-string': {
            'ProductName': manifest.name,
            'FileDescription': manifest.description
        }
    }, function (err) {
        if (!err) { deferred.resolve(); return; }
        deferred.reject(err);
    });

    return deferred.promise;
}

function rename() {
    return buildDir.renameAsync('electron.exe', manifest.name + '.exe');
}


function build() {
    return init()
        .then(copyElectron)
        .then(cleanupRuntime)
        .then(createAsar)
        .then(updateResources)
        .then(rename);
        //.then(createInstaller)??
}

module.exports = { build: build };
