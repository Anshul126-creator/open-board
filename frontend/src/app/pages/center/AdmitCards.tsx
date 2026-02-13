import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Download, FileCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import QRCode from 'qrcode';

export function AdmitCards() {
  const { students, currentUser, centers, sessions } = useData();
  
  const centerStudents = students.filter(s => s.centerId === currentUser?.centerId);
  const center = centers.find(c => c.id === currentUser?.centerId);

  const downloadAdmitCard = async (student: any) => {
    const session = sessions.find(s => s.id === student.sessionId);
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('ADMIT CARD', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Name: ${student.name}`, 20, 40);
    doc.text(`Roll Number: ${student.rollNumber}`, 20, 50);
    doc.text(`Class: ${student.class}`, 20, 60);
    doc.text(`Session: ${session?.name || '-'}`, 20, 70);
    doc.text(`Center: ${center?.name || '-'}`, 20, 80);
    doc.text(`Exam Center: ${center?.address || '-'}`, 20, 90);
    
    doc.setFontSize(10);
    doc.text('This is your official admit card for the examination.', 20, 110);
    doc.text('Please bring this card on the day of examination.', 20, 120);
    
    // Generate QR code
    try {
      const qrData = `${window.location.origin}/verify/${student.id}`;
      const qrCodeUrl = await QRCode.toDataURL(qrData);
      doc.addImage(qrCodeUrl, 'PNG', 150, 40, 40, 40);
    } catch (error) {
      console.error('QR code generation failed:', error);
    }
    
    doc.save(`admit-card-${student.rollNumber}.pdf`);
    toast.success('Admit card downloaded');
  };

  const downloadAllAdmitCards = async () => {
    toast.info('Generating admit cards for all students...');
    
    for (const student of centerStudents) {
      await downloadAdmitCard(student);
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    toast.success('All admit cards generated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl tracking-tight">Admit Cards</h2>
          <p className="text-muted-foreground">Download admit cards for your students</p>
        </div>
        <Button onClick={downloadAllAdmitCards} disabled={centerStudents.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Download All
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Students ({centerStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {centerStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono">{student.rollNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadAdmitCard(student)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {centerStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No students registered
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
