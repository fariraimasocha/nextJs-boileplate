import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { connect } from '@/utils/connect';
import Employees from '@/models/employees';

export async function GET() {
  await connect();
  try {
    const Employees = mongoose.model('Employees');
    const employees = await Employees.find();
    return NextResponse.json({ employees }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error Fetching Employees' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connect();
  try {
    const body = await req.json();
    const { first_name, last_name, position, salary, phone, department } = body;

    const employee = await Employees.create({
      first_name,
      last_name,
      position,
      phone,
      salary,
      department,
    });
    return NextResponse.json({ message: 'Employee Created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error Creating Employee' },
      { status: 500 }
    );
  }
}
