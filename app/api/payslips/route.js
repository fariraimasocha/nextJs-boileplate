import Employees from '@/models/employees';
import { connect } from '@/utils/connect';
import {
  compileDocumentText,
  findPlaceholders,
  generateFromTemplate,
  getDocumentContent,
} from '@/utils/googleDrive';
import { NextResponse } from 'next/server';

const { DOCUMENT_TEMPLATE_ID, OUTPUT_FOLDER_ID } = process.env;

export async function POST(req) {

  const { phone } = await req.json();

  await connect();

  try {
    const employee = await Employees.findOne({ phone });
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    const data = [
      { placeholder: '{{date}}', value: new Date().toLocaleDateString() },
      {
        placeholder: '{{employee name}}',
        value: `${employee.first_name} ${employee.last_name}`,
      },
      { placeholder: '{{employee position}}', value: employee.position },
      { placeholder: '{{employee dept}}', value: employee.department },
      { placeholder: '{{gross salary}}', value: employee.salary.toString() },
      {
        placeholder: '{{net salary}}',
        value: (employee.salary * 0.9).toString(),
      },
    ];

    const documentContent = await getDocumentContent(DOCUMENT_TEMPLATE_ID);
    const documentText = compileDocumentText(documentContent);
    const _placeholders = findPlaceholders(documentText);

    const docId = await generateFromTemplate(
      DOCUMENT_TEMPLATE_ID,
      OUTPUT_FOLDER_ID,
      data
    );

    employee.payslip_document_id = docId;
    await employee.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing payslip:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process payslip' },
      { status: 500 }
    );
  }
}
