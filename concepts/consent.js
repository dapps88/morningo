/* consent.js: the cookie banner's memory.
 *
 * Saves the visitor's choice ("accepted" or "declined") in one small first-party cookie, morningo-consent, that lasts 12 months;
 * after that the banner asks again. It is a strictly necessary cookie (it only remembers the choice), so it is set whichever
 * button is pressed. Loaded in the <head> of every page that has the banner. analytics.js reads the same choice from here.
 *
 * Declining removes any Google Analytics / Meta Pixel cookies already on the device (for example after accepting earlier and
 * changing your mind), so the choice is real, not just a flag.
 *
 * Earlier versions kept the choice in localStorage ('morningo-cookie-consent'). A choice saved that way is moved into the cookie
 * the first time it is read, then the old entry is removed.
 *
 * Testing: morningoConsent.clear() in the browser console, then reload, shows the banner again.
 * Note: Safari limits cookies written by scripts to about 7 days, so on iPhones the banner may come back sooner than 12 months.
 */
(function () {
  var NAME = 'morningo-consent';
  var LEGACY_KEY = 'morningo-cookie-consent';
  var MAX_AGE = 60 * 60 * 24 * 365;                       // 12 months, in seconds
  var TRACKING = /^(_ga|_ga_.+|_gid|_gat.*|_gcl_.+|_fbp|_fbc)$/;
  var memory = null;                                       // used only if the browser blocks cookies, for this page load

  function valid(value) { return value === 'accepted' || value === 'declined'; }

  function readCookie(name) {
    var pairs = document.cookie ? document.cookie.split('; ') : [];
    for (var i = 0; i < pairs.length; i++) {
      var eq = pairs[i].indexOf('=');
      if (pairs[i].slice(0, eq) === name) return decodeURIComponent(pairs[i].slice(eq + 1));
    }
    return null;
  }

  function writeCookie(value) {
    var secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = NAME + '=' + encodeURIComponent(value) + '; max-age=' + MAX_AGE + '; path=/; SameSite=Lax' + secure;
  }

  function expire(name, domain) {
    document.cookie = name + '=; max-age=0; path=/' + (domain ? '; domain=' + domain : '');
  }

  // Removes Google Analytics / Meta Pixel cookies. GA sets them on the exact host (how it works on morningo.netlify.app), or
  // on the parent domain on a custom domain, so both are tried.
  function removeTrackingCookies() {
    var labels = location.hostname.split('.');
    (document.cookie ? document.cookie.split('; ') : []).forEach(function (pair) {
      var name = pair.split('=')[0];
      if (!TRACKING.test(name)) return;
      expire(name);
      for (var i = 0; i < labels.length - 1; i++) expire(name, '.' + labels.slice(i).join('.'));
    });
  }

  function get() {
    var value = readCookie(NAME);
    if (valid(value)) return value;
    try {
      var old = localStorage.getItem(LEGACY_KEY);
      if (valid(old)) {
        writeCookie(old);
        if (valid(readCookie(NAME))) localStorage.removeItem(LEGACY_KEY);
        return old;
      }
    } catch (e) {}
    return memory;
  }

  function set(value) {
    if (!valid(value)) return;
    memory = value;
    writeCookie(value);
    if (value === 'declined') removeTrackingCookies();
  }

  function clear() {
    expire(NAME);
    memory = null;
    try { localStorage.removeItem(LEGACY_KEY); } catch (e) {}
  }

  window.morningoConsent = { get: get, set: set, clear: clear, removeTrackingCookies: removeTrackingCookies };
})();
