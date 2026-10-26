#!/usr/bin/env python3
"""Builds the Morningo MASTER LIST: one row per person, from the Netlify Forms submissions.

What it does
  Reads every "signup" and "survey" submission from Netlify (through the Netlify CLI you are already logged in with), joins them
  by email address, leaves out test emails, and writes the result as JSON for whoever fills the spreadsheet (Claude, through the
  Google Sheets connector). It never writes anywhere itself and keeps no copy of the data.

Why two rows become one
  Netlify keeps TWO separate rows per person: the sign-up row (email, ad tags, cookie choice) is saved when they enter their
  email, and the survey row (email, gender, age group, ad tags) is saved when they press Done. Skip saves no survey row.

Run:  python3 scripts/master_list.py --out /path/to/master-list.json
      add --include-tests to see the test rows too (for checking only).
The output file holds personal data: keep it OUT of the repository (use the session scratchpad or /tmp style folder).
"""
import argparse, json, subprocess, sys
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

SITE_ID = 'd0bf506a-b08e-40a7-a708-129b52e15c3b'   # the Netlify project "morningo" (an ID, not a secret)
LONDON = ZoneInfo('Europe/London')

HEADER = [
    'First saved (UK time)', 'Email', 'Gender', 'Age group', 'Survey done?', 'Survey saved (UK time)', 'Sign-ups',
    'Source', 'Medium', 'Campaign', 'Ad name', 'Ad set', 'Ad ID', 'Cookies accepted?', 'Meta event ID',
]


def netlify_submissions():
    """All submissions of the whole site, newest pages included (100 per page)."""
    rows, page = [], 1
    while True:
        data = json.dumps({'site_id': SITE_ID, 'per_page': 100, 'page': page})
        out = subprocess.run(['npx', '--yes', 'netlify-cli', 'api', 'listSiteSubmissions', '--data', data],
                             capture_output=True, text=True)
        if out.returncode != 0:
            sys.exit('Netlify CLI failed (is it logged in?): ' + out.stderr.strip()[-300:])
        try:
            batch = json.loads(out.stdout)
        except json.JSONDecodeError:
            sys.exit('Netlify CLI did not return JSON: ' + out.stdout.strip()[:300])
        rows += batch
        if len(batch) < 100:
            return rows
        page += 1


def uk(ts):
    """Netlify timestamps are UTC ('2026-10-26T12:22:54.123Z'); show them as UK time, minute precision."""
    if not ts:
        return ''
    dt = datetime.fromisoformat(ts.replace('Z', '+00:00')).astimezone(LONDON)
    return dt.strftime('%Y-%m-%d %H:%M')


def is_test(email, data):
    """A row is a test if the email is on example.com or the ad tags say claude-test-ignore."""
    e = email.lower()
    tags = (data.get('utm_campaign', '') + ' ' + data.get('utm_content', '')).lower()
    return e.endswith('@example.com') or 'claude-test-ignore' in tags or 'draft-test' in tags


def nice(text):
    return (text or '').strip().replace('_', ' ').capitalize() if text else ''


def build(submissions, include_tests=False):
    people = {}
    skipped_tests = 0
    for s in sorted(submissions, key=lambda x: x['created_at']):
        form = s.get('form_name')
        if form not in ('signup', 'survey'):
            continue
        data = s.get('data') or {}
        email = (data.get('email') or s.get('email') or '').strip().lower()
        if not email:
            continue
        if not include_tests and is_test(email, data):
            skipped_tests += 1
            continue
        p = people.setdefault(email, {'signups': [], 'surveys': []})
        p['signups' if form == 'signup' else 'surveys'].append(s)

    out = []
    for email, p in people.items():
        first = p['signups'][0] if p['signups'] else None
        survey = p['surveys'][-1] if p['surveys'] else None            # the latest answer wins
        base = first or survey
        d = (base.get('data') or {})
        consent = (first.get('data') or {}).get('capi_consent', '') if first else ''
        cookies = {'accepted': 'Yes', 'not-given': 'No'}.get(consent, 'Not recorded' if first else '')
        sd = (survey.get('data') or {}) if survey else {}
        out.append({
            'sort': base['created_at'],
            'row': [
                uk(base['created_at']), email, nice(sd.get('gender')), (sd.get('age_group') or '').replace('-', '–'),
                'Yes' if survey else 'No', uk(survey['created_at']) if survey else '', len(p['signups']) or '',
                d.get('utm_source', ''), d.get('utm_medium', ''), d.get('utm_campaign', ''), d.get('utm_content', ''),
                d.get('utm_term', ''), d.get('ad_id', ''), cookies,
                (first.get('data') or {}).get('capi_event_id', '') if first else '',
            ],
        })
    out.sort(key=lambda r: r['sort'])
    return [r['row'] for r in out], skipped_tests


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', required=True, help='where to write the JSON (outside the repository: it holds personal data)')
    ap.add_argument('--include-tests', action='store_true')
    args = ap.parse_args()
    rows, skipped = build(netlify_submissions(), args.include_tests)
    with open(args.out, 'w', encoding='utf-8') as f:
        json.dump({'header': HEADER, 'rows': rows, 'refreshed': datetime.now(timezone.utc).astimezone(LONDON).strftime('%Y-%m-%d %H:%M')}, f, ensure_ascii=False)
    print(f'{len(rows)} people in the master list; {skipped} test submissions left out; written to {args.out}')
