// Netlify serverless function — MailerLite subscriber proxy
// Keeps API key server-side, never exposed to frontend

const MAILERLITE_API = 'https://connect.mailerlite.com/api/subscribers';

const GROUPS = {
  guide: process.env.MAILERLITE_GROUP_GUIDE,
  newsletter: process.env.MAILERLITE_GROUP_NEWSLETTER,
};

export default async (request) => {
  // Only POST allowed
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // CORS headers for the landing page
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const { email, form } = await request.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers,
      });
    }

    // Validate form type
    const groupId = GROUPS[form];
    if (!groupId) {
      return new Response(JSON.stringify({ error: 'Invalid form type' }), {
        status: 400,
        headers,
      });
    }

    const apiKey = process.env.MAILERLITE_API_KEY;
    if (!apiKey) {
      console.error('MAILERLITE_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers,
      });
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
      return new Response(JSON.stringify({ error: 'Subscription failed' }), {
        status: response.status >= 500 ? 502 : 400,
        headers,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error('Subscribe function error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers,
    });
  }
};

export const config = {
  path: '/.netlify/functions/subscribe',
};
