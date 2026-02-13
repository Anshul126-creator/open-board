'use client';

import { useParams } from 'next/navigation';
import { useData } from '@/app/contexts/DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ShieldCheck } from 'lucide-react';

export default function VerifyPage() {
  const { studentId } = useParams();
  const { students, centers, sessions, marks, subjects } = useData();

  const student = students.find(s => s.id === studentId);
  const center = centers.find(c => c.id === student?.centerId);
  const session = sessions.find(s => s.id === student?.sessionId);
  const studentMarks = marks.filter(m => m.studentId === studentId);

  const calculateTotal = () => {
    return studentMarks.reduce((sum, m) => sum + m.marks, 0);
  };

  const calculatePercentage = () => {
    const total = calculateTotal();
    const maxTotal = studentMarks.reduce((sum, m) => sum + m.maxMarks, 0);
    return maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(2) : 0;
  };

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl mb-2">Invalid Document</h2>
            <p className="text-muted-foreground">
              The document you are trying to verify could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <ShieldCheck className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Document Verified</CardTitle>
            <p className="text-muted-foreground">This document is authentic and verified</p>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p>{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Roll Number</p>
                <p className="font-mono">{student.rollNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <Badge>{student.class}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Session</p>
                <p>{session?.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Father's Name</p>
                <p>{student.fatherName || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p>{student.dob ? new Date(student.dob).toLocaleDateString() : '-'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Center Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Center Name</p>
                <p>{center?.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Center Code</p>
                <p className="font-mono">{center?.code || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={center?.status === 'active' ? 'bg-green-100 text-green-800' : ''}>
                  {center?.status || '-'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p>{center?.address || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p>{center?.phone || '-'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {studentMarks.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total Marks</p>
                  <p className="text-2xl">{calculateTotal()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Percentage</p>
                  <p className="text-2xl">{calculatePercentage()}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subjects</p>
                  <p className="text-2xl">{studentMarks.length}</p>
                </div>
              </div>

              <div className="space-y-2">
                {studentMarks.map((mark) => {
                  const subject = subjects.find(s => s.id === mark.subjectId);
                  const percentage = ((mark.marks / mark.maxMarks) * 100).toFixed(0);
                  
                  return (
                    <div key={mark.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>{subject?.name || 'Unknown'}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {mark.marks} / {mark.maxMarks}
                        </span>
                        <Badge variant="outline">{percentage}%</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Verification Successful</p>
              <p className="text-sm text-green-700 mt-1">
                This document has been verified against our database. All information is accurate as of {new Date().toLocaleDateString()}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
