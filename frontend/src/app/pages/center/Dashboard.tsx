import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, FileCheck, DollarSign, BookMarked } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function CenterDashboard() {
  const { students, payments, marks, currentUser, subjects } = useData();
  
  // Filter data for current center
  const centerStudents = students.filter(s => s.centerId === currentUser?.centerId);
  const centerPayments = payments.filter(p => 
    centerStudents.some(s => s.id === p.studentId)
  );
  const centerMarks = marks.filter(m =>
    centerStudents.some(s => s.id === m.studentId)
  );

  const totalStudents = centerStudents.length;
  const documentsUploaded = centerStudents.filter(s => s.documents.length > 0).length;
  const marksEntered = centerMarks.length;
  const paymentsCompleted = centerPayments.filter(p => p.status === 'completed').length;

  // Students by class
  const studentsByClass = centerStudents.reduce((acc, student) => {
    const existing = acc.find(item => item.name === student.class);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ name: student.class, count: 1 });
    }
    return acc;
  }, [] as { name: string; count: number }[]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">Center Dashboard</h2>
        <p className="text-muted-foreground">Overview of your center's activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Registered at your center</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Documents</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{documentsUploaded}</div>
            <p className="text-xs text-muted-foreground">Students with documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Marks Entered</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{marksEntered}</div>
            <p className="text-xs text-muted-foreground">Total mark entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{paymentsCompleted}</div>
            <p className="text-xs text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Students by Class</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentsByClass}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
