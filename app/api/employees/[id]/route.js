import { NextResponse } from 'next/server';
import connect from '@/utils/connect';
import Employees from '@/models/employees';

export async function GET(req, context) {
  await connect();
  try {
    const { id } = await context.params;
    const employee = await Employees.findById(id);
    return NextResponse.json({ employee }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error Fetching Employee' },
      { status: 500 }
    );
  }
}

export async function PUT(req, context) {
  await connect();
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { first_name, last_name, position, phone, salary, department } = body;

    const employee = await Employees.findByIdAndUpdate(id, {
      first_name,
      last_name,
      position,
      phone,
      salary,
      department,
    });
    console.log(employee);

    return NextResponse.json({ message: 'Employee Updated' }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error Updating Employee' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  await connect();
  try {
    const { id } = await context.params;
    const employee = await Employees.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Employee Deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error Deleting Employee' },
      { status: 500 }
    );
  }
}
