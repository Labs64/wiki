/*
 * Changelog page behaviour (progressive enhancement; the page is fully readable without it):
 *  - opens an archived year when a link points at an entry inside it
 *  - exposes window.changelogReveal() so the guided tour can show every entry
 */
(function () {
  'use strict';

  var root = document.querySelector('.cl');
  if (!root) { return; }

  var years = Array.prototype.slice.call(root.querySelectorAll('details.cl-year'));

  // open the archived year so a deep link always lands on a visible entry
  function reveal(target) {
    var d = target.closest ? target.closest('details') : null;
    while (d) { d.open = true; d = d.parentNode && d.parentNode.closest ? d.parentNode.closest('details') : null; }
  }

  function onHash() {
    if (!location.hash || location.hash.length < 2) { return; }
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) {
      reveal(target);
      target.scrollIntoView();
    }
  }

  window.addEventListener('hashchange', onHash);
  onHash();

  window.changelogReveal = function () {
    years.forEach(function (d) { d.open = true; });
  };
})();
