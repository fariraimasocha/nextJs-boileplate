import { refreshModel } from '@/utils/modelUtils';
import mongoose from 'mongoose';

const employeesSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    payslip_document_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Employees = refreshModel('Employees', employeesSchema);

export default Employees;
