import { NextResponse } from 'next/server';
import axios from 'axios';

const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;

export async function POST(req) {
  try {
    const { phone, message } = await req.json();

    const formattedPhone = phone.replace(/\D/g, '');

    await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: {
          body: message,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json(
      { error: 'Failed to send WhatsApp message' },
      { status: 500 }
    );
  }
}