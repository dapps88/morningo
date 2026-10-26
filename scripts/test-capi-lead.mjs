// Tests for netlify/functions/capi-lead.mjs. Run: node scripts/test-capi-lead.mjs
// Uses a pretend "fetch" so nothing is ever sent to Meta, and checks the safety rules: no consent = nothing sent, no plain email in
// the request, no token or email in the logs, a failing Meta never throws.
import { createHash } from 'node:crypto';
import handler, { buildRequest } from '../netlify/functions/capi-lead.mjs';

let failures = 0;
const check = (label, ok, extra = '') => { if (!ok) failures++; console.log((ok ? 'PASS ' : 'FAIL ') + label + (ok ? '' : '  ' + extra)); };

const sha = (t) => createHash('sha256').update(t).digest('hex');
const good = {
  'form-name': 'signup', email: '  Claude-Test-Ignore@Example.com ', capi_event_id: 'lead-abc-123', capi_consent: 'accepted',
  capi_fbp: 'fb.1.111.222', capi_fbc: 'fb.1.333.IwAR_x', capi_url: 'https://morningo.netlify.app/email-capture', capi_ua: 'TestAgent/1.0',
  utm_source: 'facebook',
};
const SECRET = 'EAAsecrettokenvalue123';

// ---- pure builder ----
{
  const { body } = buildRequest(good, { now: 1_800_000_000_000, testCode: 'TEST999', ip: '203.0.113.7' });
  const ev = body.data[0];
  check('builder: event name and id', ev.event_name === 'Lead' && ev.event_id === 'lead-abc-123');
  check('builder: time in seconds', ev.event_time === 1_800_000_000);
  check('builder: email is lowercased, trimmed, then SHA-256 hashed', ev.user_data.em[0] === sha('claude-test-ignore@example.com'));
  check('builder: no plain email anywhere in the body', !JSON.stringify(body).toLowerCase().includes('example.com'));
  check('builder: fbp, fbc, user agent, ip passed through', ev.user_data.fbp === 'fb.1.111.222' && ev.user_data.fbc === 'fb.1.333.IwAR_x' && ev.user_data.client_user_agent === 'TestAgent/1.0' && ev.user_data.client_ip_address === '203.0.113.7');
  check('builder: website action and page url', ev.action_source === 'website' && ev.event_source_url === 'https://morningo.netlify.app/email-capture');
  check('builder: test code goes beside data, not inside', body.test_event_code === 'TEST999' && !('test_event_code' in ev));
  check('builder: no test code when none given', !('test_event_code' in buildRequest(good, {}).body));
  check('builder: a bad ip is dropped', !('client_ip_address' in buildRequest(good, { ip: 'not an ip' }).body.data[0].user_data));
  check('builder: ad fields are not sent to Meta', !JSON.stringify(body).includes('facebook'));
}
check('builder: not the signup form -> skip', buildRequest({ email: 'a@b.co' }).skip === 'not the signup form');
check('builder: consent not given -> skip', buildRequest({ ...good, capi_consent: 'not-given' }).skip === 'no cookie consent');
check('builder: consent missing -> skip', buildRequest({ ...good, capi_consent: '' }).skip === 'no cookie consent');
check('builder: bad email -> skip', buildRequest({ ...good, email: 'nope' }).skip === 'no valid email');
check('builder: huge email -> skip', buildRequest({ ...good, email: 'a'.repeat(300) + '@x.com' }).skip === 'no valid email');
check('builder: missing event id -> skip', buildRequest({ ...good, capi_event_id: '' }).skip === 'no event reference');

// ---- the Netlify handler, with a pretend fetch and captured logs ----
const realFetch = globalThis.fetch;
const realLog = console.log, realWarn = console.warn;
async function run(data, { token = SECRET, testCode = '', fetchImpl } = {}) {
  const calls = [], logs = [];
  console.log = (...a) => logs.push(a.join(' ')); console.warn = (...a) => logs.push(a.join(' '));
  globalThis.fetch = fetchImpl || (async (url, opts) => { calls.push({ url, opts }); return { status: 200, json: async () => ({ events_received: 1, fbtrace_id: 'TRACE1' }) }; });
  if (token) process.env.META_CAPI_TOKEN = token; else delete process.env.META_CAPI_TOKEN;
  if (testCode) process.env.META_TEST_EVENT_CODE = testCode; else delete process.env.META_TEST_EVENT_CODE;
  let threw = false;
  try { await handler.formSubmitted({ data }); } catch (e) { threw = true; }
  console.log = realLog; console.warn = realWarn; globalThis.fetch = realFetch;
  return { calls, logs: logs.join('\n'), threw };
}

{
  const r = await run(good, { testCode: 'TEST999' });
  check('handler: sends exactly one request to Meta', r.calls.length === 1);
  const url = r.calls[0].url;
  check('handler: right address and version', url.startsWith('https://graph.facebook.com/v26.0/1103025172536118/events?access_token='));
  const sent = JSON.parse(r.calls[0].opts.body);
  check('handler: body has a hashed email and the test code', sent.data[0].user_data.em[0] === sha('claude-test-ignore@example.com') && sent.test_event_code === 'TEST999');
  check('handler: the plain email is not in the request body', !r.calls[0].opts.body.toLowerCase().includes('example.com'));
  check('handler: the token is not in the body or the logs', !r.calls[0].opts.body.includes(SECRET) && !r.logs.includes(SECRET));
  check('handler: logs hold no email address', !r.logs.toLowerCase().includes('example.com'));
  check('handler: logs say what Meta answered', r.logs.includes('Meta answered 200') && r.logs.includes('events_received: 1'));
  check('handler: did not throw', !r.threw);
}
{
  const r = await run({ ...good, capi_consent: 'not-given' });
  check('handler: no consent -> nothing sent', r.calls.length === 0 && r.logs.includes('skipped (no cookie consent)'));
}
{
  const r = await run({ email: 'a@b.co', message: 'not signup' });
  check('handler: another form -> nothing sent', r.calls.length === 0);
}
{
  const r = await run(good, { token: '' });
  check('handler: no token -> nothing sent, says so, does not throw', r.calls.length === 0 && r.logs.includes('META_CAPI_TOKEN is not set') && !r.threw);
}
{
  const r = await run(good, { fetchImpl: async () => { throw Object.assign(new Error('boom ' + SECRET), { name: 'TypeError' }); } });
  check('handler: Meta unreachable -> does not throw, logs only the error type', !r.threw && r.logs.includes('sending to Meta failed: TypeError') && !r.logs.includes(SECRET));
}
{
  const r = await run(good, { fetchImpl: async () => ({ status: 400, json: async () => ({ error: { code: 190, message: 'Invalid OAuth access token.' } }) }) });
  check('handler: Meta says no -> does not throw, logs the reason', !r.threw && r.logs.includes('ERROR 190: Invalid OAuth access token.'));
}
{
  const r = await run(good, { fetchImpl: async () => ({ status: 502, json: async () => { throw new Error('not json'); } }) });
  check('handler: unreadable reply -> does not throw', !r.threw && r.logs.includes('Meta answered 502'));
}

console.log(failures ? failures + ' FAILED' : 'ALL PASSED');
process.exit(failures ? 1 : 0);
