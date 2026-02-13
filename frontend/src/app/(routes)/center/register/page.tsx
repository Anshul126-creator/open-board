'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">Student Registration</h2>
        <p className="text-muted-foreground">Register new students at your center</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registration Form</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Registration form component goes here</p>
        </CardContent>
      </Card>
    </div>
  );
}
