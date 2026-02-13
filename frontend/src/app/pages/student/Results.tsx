import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Download, FileText, Award, QrCode } from 'lucide-react';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import QRCode from 'qrcode';

export function StudentResults() {
  const { currentUser, students, marks, subjects, results, sessions, centers } = useData();
  
  const studentData = students.find(s => s.email === currentUser?.email);
  const studentMarks = marks.filter(m => m.studentId === studentData?.id);
  const center = centers.find(c => c.id === studentData?.centerId);
  const session = sessions.find(s => s.id === studentData?.sessionId);
  
  // Check if results are published
  const resultPublished = results.find(
    r => r.sessionId === studentData?.sessionId && 
         r.classId === studentData?.class && 
         r.isPublished
  );

  const calculateTotal = () => {
    return studentMarks.reduce((sum, m) => sum + m.marks, 0);
  };

  const calculatePercentage = () => {
    const total = calculateTotal();
    const maxTotal = studentMarks.reduce((sum, m) => sum + m.maxMarks, 0);
    return maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(2) : 0;
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const downloadMarksheet = async () => {
    const doc = new jsPDF();
    const percentage = parseFloat(calculatePercentage().toString());
    
    // Add content to PDF
    doc.setFontSize(20);
    doc.text('MARKSHEET', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Name: ${studentData?.name}`, 20, 40);
    doc.text(`Roll Number: ${studentData?.rollNumber}`, 20, 50);
    doc.text(`Class: ${studentData?.class}`, 20, 60);
    doc.text(`Session: ${session?.name || '-'}`, 20, 70);
    doc.text(`Center: ${center?.name || '-'}`, 20, 80);
    
    // Marks table header
    doc.setFontSize(10);
    let y = 100;
    doc.text('Subject', 20, y);
    doc.text('Marks Obtained', 80, y);
    doc.text('Maximum Marks', 130, y);
    
    y += 10;
    doc.line(20, y - 5, 190, y - 5);
    
    // Marks rows
    studentMarks.forEach((mark) => {
      const subject = subjects.find(s => s.id === mark.subjectId);
      doc.text(subject?.name || 'Unknown', 20, y);
      doc.text(mark.marks.toString(), 80, y);
      doc.text(mark.maxMarks.toString(), 130, y);
      y += 10;
    });
    
    y += 10;
    doc.line(20, y - 5, 190, y - 5);
    doc.text(`Total: ${calculateTotal()}`, 20, y);
    doc.text(`Percentage: ${percentage}%`, 20, y + 10);
    doc.text(`Grade: ${getGrade(percentage)}`, 20, y + 20);
    
    // Generate QR code for verification
    try {
      const qrData = `${window.location.origin}/verify/${studentData?.id}`;
      const qrCodeUrl = await QRCode.toDataURL(qrData);
      doc.addImage(qrCodeUrl, 'PNG', 150, y + 10, 30, 30);
      doc.setFontSize(8);
      doc.text('Scan to verify', 158, y + 45);
    } catch (error) {
      console.error('QR code generation failed:', error);
    }
    
    doc.save(`marksheet-${studentData?.rollNumber}.pdf`);
    toast.success('Marksheet downloaded');
  };

  const downloadAdmitCard = async () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('ADMIT CARD', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Name: ${studentData?.name}`, 20, 40);
    doc.text(`Roll Number: ${studentData?.rollNumber}`, 20, 50);
    doc.text(`Class: ${studentData?.class}`, 20, 60);
    doc.text(`Session: ${session?.name || '-'}`, 20, 70);
    doc.text(`Center: ${center?.name || '-'}`, 20, 80);
    doc.text(`Exam Center: ${center?.address || '-'}`, 20, 90);
    
    doc.setFontSize(10);
    doc.text('This is your official admit card for the examination.', 20, 110);
    doc.text('Please bring this card on the day of examination.', 20, 120);
    
    // Generate QR code
    try {
      const qrData = `${window.location.origin}/verify/${studentData?.id}`;
      const qrCodeUrl = await QRCode.toDataURL(qrData);
      doc.addImage(qrCodeUrl, 'PNG', 150, 40, 40, 40);
    } catch (error) {
      console.error('QR code generation failed:', error);
    }
    
    doc.save(`admit-card-${studentData?.rollNumber}.pdf`);
    toast.success('Admit card downloaded');
  };

  const downloadCertificate = async () => {
    const doc = new jsPDF('landscape');
    
    // Certificate border
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    doc.setLineWidth(0.5);
    doc.rect(15, 15, 267, 180);
    
    doc.setFontSize(28);
    doc.text('CERTIFICATE OF COMPLETION', 148.5, 40, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('This is to certify that', 148.5, 70, { align: 'center' });
    
    doc.setFontSize(22);
    doc.text(studentData?.name || '', 148.5, 90, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(`Roll Number: ${studentData?.rollNumber}`, 148.5, 110, { align: 'center' });
    doc.text(`has successfully completed ${studentData?.class}`, 148.5, 125, { align: 'center' });
    doc.text(`in the academic session ${session?.name || '-'}`, 148.5, 140, { align: 'center' });
    doc.text(`with ${calculatePercentage()}% (Grade: ${getGrade(parseFloat(calculatePercentage().toString()))})`, 148.5, 155, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 180);
    doc.text('Authorized Signature', 230, 180);
    
    doc.save(`certificate-${studentData?.rollNumber}.pdf`);
    toast.success('Certificate downloaded');
  };

  if (!resultPublished) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl tracking-tight">My Results</h2>
          <p className="text-muted-foreground">View your exam results and download documents</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl mb-2">Results Not Published Yet</h3>
            <p className="text-muted-foreground">
              Your results will be available here once they are published by the admin.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const percentage = parseFloat(calculatePercentage().toString());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">My Results</h2>
        <p className="text-muted-foreground">View your exam results and download documents</p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Result Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Marks</p>
              <p className="text-2xl">{calculateTotal()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Percentage</p>
              <p className="text-2xl">{percentage}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Grade</p>
              <Badge className="text-xl px-4 py-2">{getGrade(percentage)}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Marks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Marks Obtained</TableHead>
                <TableHead>Maximum Marks</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentMarks.map((mark) => {
                const subject = subjects.find(s => s.id === mark.subjectId);
                const subjectPercentage = ((mark.marks / mark.maxMarks) * 100).toFixed(2);
                
                return (
                  <TableRow key={mark.id}>
                    <TableCell>{subject?.name || 'Unknown'}</TableCell>
                    <TableCell>{mark.marks}</TableCell>
                    <TableCell>{mark.maxMarks}</TableCell>
                    <TableCell>{subjectPercentage}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Download Options */}
      <Card>
        <CardHeader>
          <CardTitle>Download Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button onClick={downloadAdmitCard} variant="outline" className="h-auto py-4 flex-col gap-2">
              <FileText className="w-6 h-6" />
              <span>Download Admit Card</span>
            </Button>
            <Button onClick={downloadMarksheet} variant="outline" className="h-auto py-4 flex-col gap-2">
              <Download className="w-6 h-6" />
              <span>Download Marksheet</span>
            </Button>
            <Button onClick={downloadCertificate} variant="outline" className="h-auto py-4 flex-col gap-2">
              <Award className="w-6 h-6" />
              <span>Download Certificate</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Verification Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Document Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Use this link to verify your documents:
          </p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={`${window.location.origin}/verify/${studentData?.id}`}
              className="font-mono text-sm"
            />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/verify/${studentData?.id}`);
                toast.success('Link copied to clipboard');
              }}
            >
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}