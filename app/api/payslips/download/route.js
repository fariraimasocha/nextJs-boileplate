import Employees from '@/models/employees';
import { connect } from '@/utils/connect';
import { downloadDocumentFromGoogleDrive } from '@/utils/googleDrive';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await connect();
  try {


    // Get documentId and fileType from search params
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');
    const fileType = 'pdf';

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Download the file from Google Drive
    const fileBuffer = await downloadDocumentFromGoogleDrive(
      documentId,
      fileType
    );

    // Set appropriate headers based on file type
    const contentType =
      fileType === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    const fileName = `payslip.${fileType}`;

    // Create response with file data and headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    );
  }
}
