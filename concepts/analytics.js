/* analytics.js: "the counters".
 *
 * Loads Google Analytics 4 and the Meta Pixel and sends them what visitors do on the page. Consent-gated: nothing here
 * loads or runs until the visitor has pressed Accept on the cookie banner. The banner code on each page saves the choice
 * and announces it with a "morningo-consent" event; this file also reads the saved choice on every later page load.
 * The ad-to-signup link (which ad did this person come from) is NOT in here: that is attribution.js, which needs no consent.
 *
 * Page type comes from the script tag: data-page="home" | "capture" | "thank-you". (The privacy page does not load this file.)
 *
 * TESTING
 *   - Reset the saved cookie choice: run  morningoConsent.clear()  in the browser console, reload (it is the cookie morningo-consent).
 *   - On localhost, file:// and Netlify preview links (anything--morningo.netlify.app) this runs as a DRY RUN: nothing is sent
 *     to Google or Meta. Each event is printed to the console and kept in window.morningoAnalyticsLog instead, so test visits
 *     never pollute the real numbers. To send for real from one of those hosts, add ?mo_analytics=live to the address.
 *
 * EVENTS (names are snake_case; the details are in references/analytics-tracking-plan.md)
 *   home:      section_view, carousel_slide_view, carousel_interact, accordion_open, cta_click, question_open, question_asked, question_sent
 *   capture:   signup_start, question_open, question_asked, question_sent
 *   thank-you: generate_lead (plus the Pixel "Lead"), share_copy, question_open, question_asked, question_sent
 *   Google's own page_view and the Pixel's PageView fire automatically when the tags load, on all three pages.
 *   The lead event fires on thank-you page load only, never on the form submit (brief.md, Locked Decisions).
 */
(function () {
  'use strict';

  // ---- Settings -----------------------------------------------------------------------------------------------
  var GA_ID = 'G-33SVXEVNJP';   // Google Analytics 4 Measurement ID
  var PIXEL_ID = '';            // Meta Pixel ID (15-16 digits, from Meta Events Manager). Empty = the Pixel is not loaded.

  var script = document.currentScript;
  var page = (script && script.getAttribute('data-page')) || '';

  var isTestHost = /^(|localhost|127\.0\.0\.1|.+\.github\.io|.+--morningo\.netlify\.app)$/.test(location.hostname);
  var dryRun = isTestHost && !/[?&]mo_analytics=live\b/.test(location.search);

  // The saved choice ('accepted' / 'declined', or null) comes from consent.js, the 12-month cookie the banner writes.
  var consent = window.morningoConsent ? window.morningoConsent.get() : null;

  var log = window.morningoAnalyticsLog = [];

  // ---- Sending ------------------------------------------------------------------------------------------------
  function record(kind, name, params) {
    log.push({ kind: kind, name: name, params: params || {} });
    console.info('[Morningo analytics] ' + kind + ': ' + name, params || {});
  }

  function track(name, params) {
    if (consent !== 'accepted') return;
    if (dryRun) return record('GA4', name, params);
    if (window.gtag) window.gtag('event', name, params || {});
  }

  function pixel(name, params) {
    if (consent !== 'accepted') return;
    if (dryRun) return record('Pixel', name + (PIXEL_ID ? '' : ' (no Pixel ID set yet)'), params);
    if (window.fbq) window.fbq('track', name, params || {});
  }

  window.morningoTrack = track; // used by the question modal on each page (question_sent)

  // ---- Loading the tags (only ever called after Accept) -------------------------------------------------------
  function loadGoogle() {
    if (dryRun) return record('GA4', 'would load tag ' + GA_ID);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // beacon transport so a click that navigates away (the CTA) still gets counted. Google signals and ad
    // personalisation are off: GA4 is here to count visits, not to build ad audiences.
    window.gtag('config', GA_ID, {
      transport_type: 'beacon',
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(tag);
  }

  // Meta's standard base code, unrolled. It also sends the Pixel's own PageView.
  function loadPixel() {
    if (dryRun) return record('Pixel', PIXEL_ID ? 'would load pixel ' + PIXEL_ID : 'no Pixel ID set yet, not loaded');
    if (!PIXEL_ID || window.fbq) return;
    var fbq = window.fbq = function () {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
      else fbq.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(tag);
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  // ---- What we count ------------------------------------------------------------------------------------------
  function labelOf(el) {
    var heading = el.querySelector('h3');
    var img = el.tagName === 'IMG' ? el : el.querySelector('img');
    var text = (heading && heading.textContent) || (img && img.getAttribute('alt')) || '';
    return text.replace(/\s+/g, ' ').trim().slice(0, 60);
  }

  // How far down the page people get: fires once per section, the first time any part of it is in the top 60% of the screen.
  function watchSections() {
    if (!('IntersectionObserver' in window)) return;
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id || entry.target.tagName.toLowerCase();
        if (seen[id]) return;
        seen[id] = true;
        io.unobserve(entry.target);
        track('section_view', { section_id: id });
      });
    }, { rootMargin: '0px 0px -40% 0px' });
    document.querySelectorAll('#hero, #problem, #the-product, #why-it-works, #social-proof, footer')
      .forEach(function (el) { io.observe(el); });
  }

  // Which slide/card people reach: a slide counts as viewed once, when it is mostly inside its carousel AND the carousel is
  // on screen (a carousel below the fold has its first card "visible" inside the box but nobody has seen it yet).
  // carousel_interact fires once, the first time the visitor actually moves the carousel sideways.
  function watchCarousel(name, el) {
    if (!el) return;
    var items = Array.prototype.slice.call(el.children);
    var onScreen = false;
    var visible = {};
    var seen = {};
    var interacted = false;

    function flush() {
      if (!onScreen) return;
      Object.keys(visible).forEach(function (i) {
        if (!visible[i] || seen[i]) return;
        seen[i] = true;
        track('carousel_slide_view', { carousel_name: name, slide_number: Number(i) + 1, slide_name: labelOf(items[i]) });
      });
    }

    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { onScreen = entry.isIntersecting; });
      flush();
    }, { threshold: 0.35 }).observe(el);

    var slides = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[items.indexOf(entry.target)] = entry.isIntersecting; });
      flush();
    }, { root: el, threshold: 0.6 });
    items.forEach(function (item) { slides.observe(item); });

    el.addEventListener('scroll', function () {
      if (interacted || el.scrollLeft < 8) return;
      interacted = true;
      track('carousel_interact', { carousel_name: name });
    }, { passive: true });
  }

  function watchCarousels() {
    if (!('IntersectionObserver' in window)) return;
    watchCarousel('hero_gallery', document.getElementById('hero-gallery'));
    watchCarousel('why_it_works', document.querySelector('#why-it-works .card-carousel'));
    watchCarousel('reviews', document.querySelector('#social-proof .card-carousel'));
  }

  // "What's in it" and the other accordions: once per accordion per visit.
  function watchAccordions() {
    var seen = {};
    document.addEventListener('toggle', function (e) {
      var details = e.target;
      if (!details || details.tagName !== 'DETAILS' || !details.open) return;
      var summary = details.querySelector('summary');
      var name = summary ? summary.textContent.replace(/\s+/g, ' ').trim().slice(0, 60) : '';
      if (!name || seen[name]) return;
      seen[name] = true;
      track('accordion_open', { accordion_name: name });
    }, true);
  }

  function watchCtas() {
    [['hero-cta', 'hero'], ['sticky-cta-button', 'sticky']].forEach(function (pair) {
      var button = document.getElementById(pair[0]);
      if (button) button.addEventListener('click', function () { track('cta_click', { cta_location: pair[1] }); });
    });
  }

  // Every "Have a question?" entry point carries the .chat-trigger class. Capture phase, so it still counts if the page's own
  // handler stops the click.
  function watchQuestionOpen() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest && e.target.closest('.chat-trigger');
      if (!trigger) return;
      var where = trigger.closest('footer') ? 'footer' : trigger.closest('header') ? 'header' : trigger.closest('#hero') ? 'hero' : 'page';
      track('question_open', { trigger_location: where });
    }, true);
  }

  // First time the visitor clicks into the email box on the capture page: the step between "saw the page" and "signed up".
  function watchSignup() {
    var input = document.getElementById('email-input');
    if (!input) return;
    input.addEventListener('focus', function onFocus() {
      input.removeEventListener('focus', onFocus);
      track('signup_start');
    });
  }

  function watchShare() {
    var button = document.getElementById('copy-link-button');
    if (button) button.addEventListener('click', function () { track('share_copy'); });
  }

  // The conversion. Fires on thank-you page load, and only once per browser tab session, so a refresh of the thank-you
  // page does not count the same sign-up twice. (Netlify Forms stays the source of truth for the real signup count.)
  function fireLead() {
    var already = false;
    try { already = sessionStorage.getItem('morningo-lead-sent') === '1'; } catch (e) {}
    if (already) return;
    try { sessionStorage.setItem('morningo-lead-sent', '1'); } catch (e) {}
    track('generate_lead');
    pixel('Lead');
  }

  // ---- Start (only after Accept) ------------------------------------------------------------------------------
  var started = false;
  function start() {
    if (started) return;
    started = true;
    loadGoogle();
    loadPixel();
    watchQuestionOpen();
    if (page === 'home') { watchSections(); watchCarousels(); watchAccordions(); watchCtas(); }
    if (page === 'capture') watchSignup();
    if (page === 'thank-you') { fireLead(); watchShare(); }
  }

  // Withdrawing consent (accepted, then declined): stop sending straight away. consent.js removes the Google/Meta cookies.
  function stop() {
    window['ga-disable-' + GA_ID] = true;
    if (dryRun && started) record('GA4', 'consent withdrawn, sending stopped');
  }

  document.addEventListener('morningo-consent', function (e) {
    consent = e.detail;
    if (consent === 'accepted') { window['ga-disable-' + GA_ID] = false; start(); }
    else stop();
  });
  if (consent === 'accepted') start();
})();
