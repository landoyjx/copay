'use strict';

angular.element(document).ready(function() {

  // Run copayApp after device is ready.
  var startAngular = function() {
    angular.bootstrap(document, ['copayApp']);
  };

  var handleBitcoinURI = function(url) {
    if (!url) return;
    if (url.indexOf('glidera') != -1) {
      url = '#/uri-glidera' + url.replace('bitcoin://glidera', '');
    } else {
      url = '#/uri-payment/' + url;
    }
    setTimeout(function() {
      window.location = url;
    }, 1000);
  };


  /* Cordova specific Init */
  if (window.cordova !== undefined) {

    document.addEventListener('deviceready', function() {
      var exitApp = false,
        intval = setInterval(function() {
          exitApp = false;
        }, 2000);

      document.addEventListener('pause', function() {
        if (!window.ignoreMobilePause) {
          setTimeout(function() {
            window.location = '#/cordova/pause/';
          }, 100);
        }
      }, false);

      document.addEventListener('resume', function() {
        if (!window.ignoreMobilePause) {
          setTimeout(function() {
            window.location = '#/cordova/resume/';
          }, 100);
        }
        setTimeout(function() {
          window.ignoreMobilePause = false;
        }, 100);
      }, false);

      // Back button event

      document.addEventListener('backbutton', function() {
        if (exitApp) {
          clearInterval(intval)
          var loc = window.location;
          var exit = loc.toString().match(/disclaimer/) ? 'true' : '';
          if (exit != 'true')
            var exit = loc.toString().match(/index\.html#\/$/) ? 'true' : '';
          if (!window.ignoreMobilePause) {
            window.location = '#/cordova/backbutton/' + exit;
          }
          setTimeout(function() {
            window.ignoreMobilePause = false;
          }, 100);
        } else {
          window.plugins.toast.showShortCenter('Press again to exit');
          exitApp = true;
        }
      }, false);

      document.addEventListener('menubutton', function() {
        window.location = '#/preferences';
      }, false);

      setTimeout(function() {
        navigator.splashscreen.hide();
      }, 2000);

      window.plugins.webintent.getUri(handleBitcoinURI);
      window.plugins.webintent.onNewIntent(handleBitcoinURI);
      window.handleOpenURL = handleBitcoinURI;

      window.plugins.touchid.isAvailable(
        function(msg) {
          window.touchidAvailable = true;
        }, // success handler: TouchID available
        function(msg) {
          window.touchidAvailable = false;
        } // error handler: no TouchID available
      );

      startAngular();
    }, false);
  } else {
    try {
      window.handleOpenURL = handleBitcoinURI;
      window.plugins.webintent.getUri(handleBitcoinURI);
      window.plugins.webintent.onNewIntent(handleBitcoinURI);
    } catch (e) {}

    startAngular();
  }

});
