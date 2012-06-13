// Save2Drive by Scott Cheng
// Background script

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-32579564-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var capitalise = function(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
};


// Add context menu
(function(){
  var contexts = ['link', 'image', 'audio', 'video'];
  for (var i in contexts) {
    (function() {
      var context = contexts[i];
      chrome.contextMenus.create({
        title: chrome.i18n.getMessage('menuItemText' + capitalise(context)),
        contexts: [context],
        onclick: function(info, tab) {
          if (context === 'link') {
            saveToDrive(info.linkUrl, context);
          } else {
            saveToDrive(info.srcUrl, context);
          }
        }
      });
    })();
  }
})();

var saveToDrive = function(url, context) {
  _gaq.push(['_trackEvent', 'Save', 'clickSave', context]);

  // Indicate saving in progress
  showNotif(context);

  var target = 'https://docs.google.com/viewer?a=sv&url=' + encodeURIComponent(url);
  $.get(target, function(data, textStatus, jqXHR) {
    onSaveSuccess(context);
  }, 'html').error(function(jqXHR, textStatus, errorThrown) {
    onSaveError(context, target);
  });
};

var onSaveSuccess = function(context) {
  _gaq.push(['_trackEvent', 'Save', 'succeed', context]);

  chrome.extension.getViews({type: 'notification'}).forEach(function(notifWindow) {
    notifWindow.onSaveSuccess();
  });
};

var onSaveError = function(context, target) {
  _gaq.push(['_trackEvent', 'Save', 'fail', context]);

  chrome.extension.getViews({type: 'notification'}).forEach(function(notifWindow) {
    notifWindow.onSaveError(target);
  });
};

var showNotif = (function() {
  var notif;
  return function(context) {
    notif && notif.cancel();
    notif = window.webkitNotifications.createHTMLNotification(
      'notif.html?context=' + context
    );
    notif.show();
  };
})();

var onVisitDrive = function() {
  _gaq.push(['_trackEvent', 'Notification', 'visitDrive']);
};