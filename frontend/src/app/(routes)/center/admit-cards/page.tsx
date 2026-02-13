'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdmitCardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">Admit Cards</h2>
        <p className="text-muted-foreground">Generate and download student admit cards</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admit Card Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Admit card generation component goes here</p>
        </CardContent>
      </Card>
    </div>
  );
}
