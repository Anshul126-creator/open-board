import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Building2, GraduationCap } from 'lucide-react';

export function StudentProfile() {
  const { currentUser, students, centers, sessions } = useData();
  
  // Find the student record for the logged-in user
  const studentData = students.find(s => s.email === currentUser?.email);
  const center = centers.find(c => c.id === studentData?.centerId);
  const session = sessions.find(s => s.id === studentData?.sessionId);

  if (!studentData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Student profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">My Profile</h2>
        <p className="text-muted-foreground">View your personal information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p>{studentData.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Roll Number</p>
              <p className="font-mono">{studentData.rollNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p>{studentData.dob ? new Date(studentData.dob).toLocaleDateString() : '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Father's Name</p>
              <p>{studentData.fatherName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mother's Name</p>
              <p>{studentData.motherName || '-'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{studentData.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p>{studentData.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p>{studentData.address || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Class</p>
              <Badge>{studentData.class}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Session</p>
              <p>{session?.name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registration Date</p>
              <p>{new Date(studentData.registrationDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Center Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Center Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Center Name</p>
              <p>{center?.name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Center Code</p>
              <p className="font-mono">{center?.code || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Center Address</p>
              <p>{center?.address || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Center Contact</p>
              <p>{center?.phone || '-'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
