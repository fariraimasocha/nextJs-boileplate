import { NextResponse } from 'next/server';
import Employees from '@/models/employees';

const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;

export async function POST(req) {
  try {
    const { phone } = await req.json();

    const employee = await Employees.findOne({ phone });

    const formattedPhone = phone.replace(/\D/g, '');
    const url = `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    console.log('url:', url);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedPhone,
        type: 'document',
        document: {
          link: `https://437e-2c0f-f8f0-c339-0-7543-a90f-66c5-d44.ngrok-free.app/api/payslips/download/?documentId=${employee.payslip_document_id}`,
          filename: 'payslip',
        },
      }),
    });

    const data = await res.json();
    console.log('WhatsApp message sent:', data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json(
      { error: 'Failed to send WhatsApp message' },
      { status: 500 }
    );
  }
}
