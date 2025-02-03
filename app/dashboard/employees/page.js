'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    position: '',
    phone: '',
    salary: '',
    department: '',
  });
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    position: '',
    phone: '',
    salary: '',
    department: ''
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const response = await fetch('/api/employees');
        const data = await response.json();
        setEmployees(data.employees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    getEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsOpen(false);
        resetForm();
        toast.success('Employee created successfully');
        const newData = await fetch('/api/employees');
        const { employees } = await newData.json();
        setEmployees(employees);
      } else {
        toast.error('Failed to create employee');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error('Error creating employee');
    }
  };

  const fetchEmployeeDetails = async (id) => {
    try {
      const response = await fetch(`/api/employees/${id}`);
      const data = await response.json();
      setSelectedEmployee(data.employee);
      setIsViewOpen(true);
    } catch (error) {
      toast.error('Error fetching employee details');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      position: '',
      phone: '',
      salary: '',
      department: '',
    });
  };

  const handleSendPayslips = async () => {
    try {
      toast.loading('Processing payslips...');

      const generatePromises = employees.map(employee => 
        fetch('/api/payslips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: employee.phone })
        })
      );

      const generateResults = await Promise.all(generatePromises);

      const failedGenerations = generateResults.filter(res => !res.ok);
      if (failedGenerations.length > 0) {
        throw new Error(`Failed to generate ${failedGenerations.length} payslips`);
      }

      const sendPromises = employees.map(employee =>
        fetch('/api/whatsapp/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: employee.phone })
        })
      );


      const sendResults = await Promise.all(sendPromises);


      const failedSends = sendResults.filter(res => !res.ok);
      if (failedSends.length > 0) {
        throw new Error(`Failed to send ${failedSends.length} payslips`);
      }

      toast.dismiss(); 
      toast.success(`Successfully processed ${employees.length} payslips`);

    } catch (error) {
      toast.dismiss(); 
      console.error('Error in batch payslip processing:', error);
      toast.error(error.message || 'Error processing payslips');
    }
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateEmployee = async () => {
    try {
      const response = await fetch(`/api/employees/${selectedEmployee._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        toast.success('Employee updated successfully');
        setIsEditing(false);
        // Refresh employee list
        const newData = await fetch('/api/employees');
        const { employees } = await newData.json();
        setEmployees(employees);
        // Refresh selected employee details
        fetchEmployeeDetails(selectedEmployee._id);
      } else {
        toast.error('Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Error updating employee');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Employee deleted successfully');
        // Refresh employee list
        const newData = await fetch('/api/employees');
        const { employees } = await newData.json();
        setEmployees(employees);
        setIsDeleteDialogOpen(false);
      } else {
        toast.error('Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Error deleting employee');
    }
  };

  const departments = [...new Set(employees?.map((emp) => emp.department))];

  const filteredEmployees = employees
    ?.filter((emp) =>
      selectedDepartment === 'all'
        ? true
        : emp.department === selectedDepartment
    )
    ?.filter(
      (emp) =>
        emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <div className="container mx-auto py-10 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-light tracking-tight">Employees</h1>
          <div className="flex space-x-4">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>Add Employee</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <Card>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            First Name
                          </label>
                          <Input
                            id="first_name"
                            name="first_name"
                            placeholder="First Name"
                            value={formData.first_name || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Last Name
                          </label>
                          <Input
                            id="last_name"
                            name="last_name"
                            placeholder="Last Name"
                            value={formData.last_name || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Position</label>
                        <Input
                          id="position"
                          name="position"
                          placeholder="Position"
                          value={formData.position || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone</label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="Phone"
                          value={formData.phone || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Department
                          </label>
                          <Input
                            id="department"
                            name="department"
                            placeholder="Department"
                            value={formData.department || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Salary</label>
                          <Input
                            id="salary"
                            name="salary"
                            type="number"
                            placeholder="Salary"
                            value={formData.salary || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        Create Employee
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleSendPayslips}>
              Send Payslips
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments?.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees?.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell className="font-medium">
                      {employee.first_name}
                    </TableCell>
                    <TableCell>{employee.last_name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>${employee.salary.toLocaleString()}</TableCell>
                    <TableCell className='flex gap-1'>
                      <Button
                        variant="outline"
                        onClick={() => fetchEmployeeDetails(employee._id)}
                      >
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setEmployeeToDelete(employee);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Employee Details</DialogTitle>
            <Button 
              variant="outline" 
              onClick={() => {
                if (isEditing) {
                  handleUpdateEmployee();
                } else {
                  setEditData(selectedEmployee);
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </DialogHeader>
          <Card>
            <CardContent className="pt-4">
              {selectedEmployee && (
                <div className="space-y-4">
                  {isEditing ? (
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">First Name</label>
                          <Input
                            name="first_name"
                            value={editData.first_name}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Last Name</label>
                          <Input
                            name="last_name"
                            value={editData.last_name}
                            onChange={handleEditChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Position</label>
                        <Input
                          name="position"
                          value={editData.position}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone</label>
                        <Input
                          name="phone"
                          value={editData.phone}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Department</label>
                          <Input
                            name="department"
                            value={editData.department}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Salary</label>
                          <Input
                            name="salary"
                            type="number"
                            value={editData.salary}
                            onChange={handleEditChange}
                          />
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          First Name
                        </p>
                        <p className="font-medium">
                          {selectedEmployee.first_name}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Last Name</p>
                        <p className="font-medium">
                          {selectedEmployee.last_name}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Position</p>
                        <p className="font-medium">{selectedEmployee.position}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedEmployee.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Department
                        </p>
                        <p className="font-medium">
                          {selectedEmployee.department}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Salary</p>
                        <p className="font-medium">
                          ${selectedEmployee.salary.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete {employeeToDelete?.first_name} {employeeToDelete?.last_name}?
            This action cannot be undone.
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(employeeToDelete?._id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}