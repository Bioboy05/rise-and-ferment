// Netlify serverless function (v1 format) — MailerLite subscriber proxy
// Keeps API key server-side, never exposed to frontend

const MAILERLITE_API = 'https://connect.mailerlite.com/api/subscribers';

const GROUPS = {
  guide: process.env.MAILERLITE_GROUP_GUIDE,
  newsletter: process.env.MAILERLITE_GROUP_NEWSLETTER,
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function respond(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    body: JSON.stringify(body),
  };
}

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  // Only POST allowed
  if (event.httpMethod !== 'POST') {
    return respond(405, { error: 'Method not allowed' });
  }

  try {
    const { email, form } = JSON.parse(event.body);

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return respond(400, { error: 'Invalid email' });
    }

    // Validate form type
    const groupId = GROUPS[form];
    if (!groupId) {
      return respond(400, { error: 'Invalid form type' });
    }

    const apiKey = process.env.MAILERLITE_API_KEY;
    if (!apiKey) {
      console.error('MAILERLITE_API_KEY not configured');
      return respond(500, { error: 'Server configuration error' });
    }

    // Call MailerLite API
    const response = await fetch(MAILERLITE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        groups: [groupId],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MailerLite error:', response.status, data);
      return respond(response.status >= 500 ? 502 : 400, { error: 'Subscription failed' });
    }

    return respond(200, { success: true });
  } catch (err) {
    console.error('Subscribe function error:', err);
    return respond(500, { error: 'Internal error' });
  }
};
