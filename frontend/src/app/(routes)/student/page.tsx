'use client';

import { useData } from '@/app/contexts/DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudentProfilePage() {
  const { currentUser, students } = useData();
  
  const student = students.find(s => s.id === currentUser?.centerId || s.id === currentUser?.name);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">My Profile</h2>
        <p className="text-muted-foreground">View your profile information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium text-lg">{currentUser?.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium text-lg">{currentUser?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium text-lg capitalize">{currentUser?.role}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
