import { NextResponse } from 'next/server';
import axios from 'axios';

const { WHATSAPP_VERIFY_TOKEN, WHATSAPP_ACCESS_TOKEN } = process.env;

export async function POST(req) {
  // Parse the request body
  const body = await req.json();

  // log incoming message
  console.log('Incoming webhook message:', JSON.stringify(body, null, 2));

  //check if webhook contains a message
  const message = body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  if (message?.type === 'text') {
    const business_phone_number_id =
      body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

    await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v21.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      },
      data: {
        messaging_product: 'whatsapp',
        to: message.from,
        text: { body: 'https://www.fariraimasocha.co.zw/ ', preview_url: true },
        context: {
          message_id: message.id,
        },
      },
    });
    // mark incoming message as read
    await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v21.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      },
      data: {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: message.id,
      },
    });
  }

  return NextResponse.json({ success: true });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    return new NextResponse(
      challenge,
      { message: 'WEBHOOK_VERIFIED' },
      { status: 200 }
    );
  }

  return NextResponse.json({ success: false });
}
