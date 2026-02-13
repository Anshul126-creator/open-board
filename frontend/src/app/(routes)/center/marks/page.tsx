'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MarksEntryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">Enter Marks</h2>
        <p className="text-muted-foreground">Enter student marks for your center</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marks Entry Form</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Marks entry form component goes here</p>
        </CardContent>
      </Card>
    </div>
  );
}
