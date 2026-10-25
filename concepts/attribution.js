/* attribution.js: "the name tag".
 *
 * Remembers which ad brought a visitor here and hands that to the sign-up and question forms, so Netlify Forms shows
 * the ad next to every submission ("how many people from this ad signed up?", "which ad did this question come from?").
 *
 * How it works:
 *   1. Each ad's link carries its identity, set in Meta Ads Manager under the ad's "URL parameters":
 *        utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&ad_id={{ad.id}}
 *   2. This file reads those values from the address bar and adds them to every link that goes to another page of this
 *      site (and to the CTA / form redirects, through window.morningoLink), so they travel from page to page in the URL.
 *   3. It fills the hidden utm_* / ad_id fields in the forms, so they are sent along with the sign-up or the question.
 *
 * Nothing is stored on the visitor's device (no cookie, no localStorage). That is why this works for every visitor,
 * whether or not they accepted cookies, and why it is not part of analytics.js (the consent-gated counters). It is a
 * separate file on purpose: if an ad blocker stops analytics.js, the name tag still gets through.
 *
 * A visitor who did not come from a tagged ad has no values, so nothing is added and the hidden fields stay empty.
 */
(function () {
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ad_id'];
  var tags = {};

  try {
    var params = new URLSearchParams(location.search);
    KEYS.forEach(function (key) {
      var value = (params.get(key) || '').trim();
      if (value) tags[key] = value.slice(0, 200);
    });
  } catch (e) {}

  var hasTags = Object.keys(tags).length > 0;

  // Returns the same address with the ad values added, but only for addresses on this site, and never overwriting a
  // value that is already there. Anything else (other sites, mailto:, odd values) is returned untouched.
  function link(href) {
    if (!hasTags || !href) return href;
    try {
      var url = new URL(href, location.href);
      if (url.origin !== location.origin) return href;
      KEYS.forEach(function (key) {
        if (tags[key] && !url.searchParams.has(key)) url.searchParams.set(key, tags[key]);
      });
      return url.href;
    } catch (e) {
      return href;
    }
  }

  function fillForms() {
    KEYS.forEach(function (key) {
      document.querySelectorAll('input[type="hidden"][name="' + key + '"]').forEach(function (input) {
        input.value = tags[key] || '';
      });
    });
  }

  function decorateLinks() {
    if (!hasTags) return;
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || /^(#|mailto:|tel:|javascript:)/i.test(href)) return;
      a.setAttribute('href', link(href));
    });
  }

  function run() {
    fillForms();
    decorateLinks();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();

  window.morningoAdTags = tags;
  window.morningoLink = link;
})();
