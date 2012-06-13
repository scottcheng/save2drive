var capitalise = function(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

var context = window.location.search.split('=')[1];

var $msg = $('#notifMsg');
var $link = $('#link2Drive');

$msg.html(chrome.i18n.getMessage('notifSaving' + capitalise(context)));

$link.click(function() {
  chrome.extension.getBackgroundPage().onVisitDrive();
  window.close();
});

var onSaveSuccess = function() {
  $link
    .html(chrome.i18n.getMessage('notifLink'))
    .attr('href', 'https://drive.google.com/');
  $msg.html(chrome.i18n.getMessage('notifSuc' + capitalise(context)));
  startTimeout();
};

var onSaveError = function(target) {
  $link
    .html(chrome.i18n.getMessage('notifLinkError'))
    .attr('href', target)
    .addClass('error');
  $('#notifIcon').addClass('error');
  $msg.html(chrome.i18n.getMessage('notifErr' + capitalise(context)));
  startTimeout();
};

var startTimeout = function() {
  window.setTimeout(function() {
    window.close();
  }, 5000);
};