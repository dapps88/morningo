/* capi-lead.mjs: the server copy of the sign-up "Lead" for Meta (the Facebook Conversions API).
 *
 * WHAT IT DOES
 * Netlify runs this after a form submission has been verified (spam is filtered out first) and already stored. For the "signup" form
 * only, it sends one Lead event from our server to Meta, so Meta still counts a sign-up when the visitor's browser blocked the Pixel
 * (iPhones, ad blockers, some in-app browsers). The page gives the browser Pixel's Lead the same event ID (analytics.js, fireLead),
 * and Meta counts the two copies once.
 *
 * WHAT IT NEVER DOES
 *  - It sends nothing unless the visitor pressed Accept on the cookie banner (the page records that in capi_consent).
 *  - It never logs the token, the email address or any other value from the form. Logs hold field NAMES and Meta's reply only.
 *  - It never breaks a sign-up: the submission is already saved before this runs, and every failure here is caught and logged.
 *
 * SETTINGS (Netlify > Project configuration > Environment variables)
 *  META_CAPI_TOKEN        required. The access token from Events Manager > dataset > Settings > Conversions API. Secret.
 *  META_TEST_EVENT_CODE   optional. A "TEST..." code from Events Manager > Test events. Set it for Deploy Previews ONLY: with it, the
 *                         event is marked as a test. Never set it for Production.
 *
 * Meta's reference: https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api
 * Netlify's event functions: https://docs.netlify.com/build/functions/trigger-on-events/ (Netlify signs these events and checks the
 * signature before running this, so nobody can call it from outside).
 */
import { createHash } from 'node:crypto';

const PIXEL_ID = '1103025172536118';   // the "Morningo" dataset; keep the same as PIXEL_ID in concepts/analytics.js
const GRAPH_VERSION = 'v26.0';         // Meta's Graph API version (each version is supported for at least two years)
const TIMEOUT_MS = 8000;

const sha256 = (text) => createHash('sha256').update(text).digest('hex');
const looksLikeEmail = (text) => text.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
const looksLikeIp = (text) => typeof text === 'string' && /^(\d{1,3}(\.\d{1,3}){3}|[0-9a-fA-F:]{3,45})$/.test(text);

// Builds the Meta request body from the submitted fields. Returns { body } or { skip: 'reason' }. Pure, so it can be tested.
export function buildRequest(data, { now = Date.now(), testCode = '', ip = '' } = {}) {
  if (!('capi_event_id' in data)) return { skip: 'not the signup form' };
  if (data.capi_consent !== 'accepted') return { skip: 'no cookie consent' };

  const email = String(data.email || '').trim().toLowerCase();
  if (!looksLikeEmail(email)) return { skip: 'no valid email' };

  const eventId = String(data.capi_event_id || '').slice(0, 100);
  if (!eventId) return { skip: 'no event reference' };

  const userData = { em: [sha256(email)] };
  if (data.capi_fbp) userData.fbp = String(data.capi_fbp).slice(0, 200);
  if (data.capi_fbc) userData.fbc = String(data.capi_fbc).slice(0, 300);
  if (data.capi_ua) userData.client_user_agent = String(data.capi_ua).slice(0, 500);
  if (looksLikeIp(ip)) userData.client_ip_address = ip;

  const body = {
    data: [{
      event_name: 'Lead',
      event_time: Math.floor(now / 1000),
      event_id: eventId,
      action_source: 'website',
      event_source_url: String(data.capi_url || 'https://morningo.netlify.app/email-capture').slice(0, 500),
      user_data: userData,
    }],
  };
  if (testCode) body.test_event_code = testCode;
  return { body };
}

export default {
  async formSubmitted(event) {
    const data = (event && event.data) || {};

    // Diagnostics: names only, never values.
    console.log('capi-lead: submission received. event keys:', Object.keys(event || {}).join(','), '| field names:', Object.keys(data).join(','));

    const token = process.env.META_CAPI_TOKEN;
    const ip = [event && event.ip, event && event.clientIp, data.ip, data.client_ip_address].find(looksLikeIp) || '';
    const built = buildRequest(data, { testCode: process.env.META_TEST_EVENT_CODE || '', ip });
    if (built.skip) { console.log('capi-lead: skipped (' + built.skip + ')'); return; }
    if (!token) { console.warn('capi-lead: META_CAPI_TOKEN is not set, nothing sent'); return; }

    const url = 'https://graph.facebook.com/' + GRAPH_VERSION + '/' + PIXEL_ID + '/events?access_token=' + encodeURIComponent(token);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(built.body),
        signal: controller.signal,
      });
      const reply = await res.json().catch(() => ({}));
      const u = built.body.data[0].user_data;
      console.log(
        'capi-lead: Meta answered', res.status,
        '| events_received:', reply.events_received,
        '| fbtrace_id:', reply.fbtrace_id,
        '| test mode:', Boolean(built.body.test_event_code),
        '| sent: email hash' + (u.fbp ? ', fbp' : '') + (u.fbc ? ', fbc' : '') + (u.client_user_agent ? ', user agent' : '') + (u.client_ip_address ? ', ip' : ''),
        reply.error ? '| ERROR ' + reply.error.code + ': ' + reply.error.message : ''
      );
    } catch (err) {
      console.warn('capi-lead: sending to Meta failed:', err && err.name ? err.name : 'unknown error');
    } finally {
      clearTimeout(timer);
    }
  },
};
