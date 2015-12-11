/**
 * Amy is Awesome!
 */
'use strict';

const app = require('app');
const ipc = require('ipc');

const BrowserWindow = require('browser-window');
const Menu = require('menu');

const angular = require('./main/lib/ng-electron/ng-bridge');

function createMainWindow () {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		resizable: false
	});

	win.loadUrl(`file:${__dirname}/main/index.html`);
	win.on('closed', onClosed);

	return win;
}

function onClosed() {
	mainWindow = null;
}
// prevent window being GC'd
let mainWindow;

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate-with-no-open-windows', function () {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('will-quit', function() {
	console.log('<====================================>');
	console.log('Amy Says, "Stay Awesome Kids!"');
	console.log('<====================================>');
});

app.on('ready', function () {
	mainWindow = createMainWindow();
	console.log('<====================================>');
	console.log("Amy says, \"Let's Code Awesome!\"");
	console.log('<====================================>');
	mainWindow.webContents.on('dom-ready', function(e) {
		//try and manually bootstrap AngularJS
		var code = "angular.bootstrap(document, ['app']);"
		mainWindow.webContents.executeJavaScript( code );
	});

	mainWindow.webContents.on('did-finish-load', function( e ) {
		//Start listening for client messages
		angular.listen(function(msg) {
			console.log('Client: ' + msg);
		});

	});
});
