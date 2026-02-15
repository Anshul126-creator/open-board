import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Button, Card, CardContent, CardHeader, Divider, Grid, MenuItem, Select, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

export function AttendanceManagement() {
  const { 
    currentUser, 
    classes, 
    sessions, 
    students, 
    attendances, 
    addAttendance, 
    bulkAddAttendances, 
    updateAttendance, 
    deleteAttendance, 
    getStudentAttendanceSummary, 
    getClassAttendanceSummary 
  } = useData();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Filters
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  
  const [newAttendance, setNewAttendance] = useState({
    student_id: '',
    session_id: '',
    class_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'present',
    remarks: ''
  });

  const [editingAttendance, setEditingAttendance] = useState<any>(null);
  const [bulkAttendanceData, setBulkAttendanceData] = useState<any[]>([]);
  
  // Summary data
  const [studentSummary, setStudentSummary] = useState<any>(null);
  const [classSummary, setClassSummary] = useState<any[]>([]);

  // Filtered data
  const filteredAttendances = attendances.filter(attendance => {
    const classMatch = !selectedClass || attendance.classId === selectedClass;
    const sessionMatch = !selectedSession || attendance.sessionId === selectedSession;
    const dateMatch = !selectedDate || attendance.date === format(selectedDate, 'yyyy-MM-dd');
    const studentMatch = !selectedStudent || attendance.studentId === selectedStudent;
    const statusMatch = statusFilter === 'all' || attendance.status === statusFilter;
    
    // For center staff, only show their center's attendances
    const centerMatch = currentUser?.role !== 'center' || attendance.centerId === currentUser?.centerId;
    
    return classMatch && sessionMatch && dateMatch && studentMatch && statusMatch && centerMatch;
  });

  // Filtered students for the selected class
  const filteredStudents = selectedClass 
    ? students.filter(student => student.class === selectedClass && 
        (!currentUser?.centerId || student.centerId === currentUser.centerId))
    : [];

  useEffect(() => {
    if (selectedStudent) {
      loadStudentSummary();
    }
  }, [selectedStudent]);

  useEffect(() => {
    if (selectedClass) {
      loadClassSummary();
    }
  }, [selectedClass]);

  const loadStudentSummary = async () => {
    if (!selectedStudent) return;
    
    try {
      setLoading(true);
      const summary = await getStudentAttendanceSummary(selectedStudent);
      setStudentSummary(summary);
    } catch (err) {
      setError('Failed to load student attendance summary');
    } finally {
      setLoading(false);
    }
  };

  const loadClassSummary = async () => {
    if (!selectedClass) return;
    
    try {
      setLoading(true);
      const summary = await getClassAttendanceSummary(selectedClass);
      setClassSummary(summary);
    } catch (err) {
      setError('Failed to load class attendance summary');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await addAttendance({
        student_id: newAttendance.student_id,
        session_id: newAttendance.session_id,
        class_id: newAttendance.class_id,
        date: newAttendance.date,
        status: newAttendance.status,
        remarks: newAttendance.remarks
      });
      
      setSuccess('Attendance record added successfully!');
      setShowAddForm(false);
      resetNewAttendance();
    } catch (err) {
      setError('Failed to add attendance record');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAddAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await bulkAddAttendances(bulkAttendanceData);
      
      setSuccess('Bulk attendance records added successfully!');
      setShowBulkForm(false);
      setBulkAttendanceData([]);
    } catch (err) {
      setError('Failed to add bulk attendance records');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await updateAttendance(editingAttendance.id, {
        status: editingAttendance.status,
        remarks: editingAttendance.remarks
      });
      
      setSuccess('Attendance record updated successfully!');
      setShowEditForm(false);
    } catch (err) {
      setError('Failed to update attendance record');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttendance = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await deleteAttendance(id);
      
      setSuccess('Attendance record deleted successfully!');
    } catch (err) {
      setError('Failed to delete attendance record');
    } finally {
      setLoading(false);
    }
  };

  const resetNewAttendance = () => {
    setNewAttendance({
      student_id: '',
      session_id: selectedSession || '',
      class_id: selectedClass || '',
      date: format(selectedDate || new Date(), 'yyyy-MM-dd'),
      status: 'present',
      remarks: ''
    });
  };

  const initializeBulkAttendance = () => {
    const initialData = filteredStudents.map(student => ({
      student_id: student.id,
      session_id: selectedSession,
      class_id: selectedClass,
      date: format(selectedDate || new Date(), 'yyyy-MM-dd'),
      status: 'present',
      remarks: ''
    }));
    setBulkAttendanceData(initialData);
  };

  const updateBulkStatus = (index: number, status: string) => {
    const updated = [...bulkAttendanceData];
    updated[index].status = status;
    setBulkAttendanceData(updated);
  };

  const updateBulkRemarks = (index: number, remarks: string) => {
    const updated = [...bulkAttendanceData];
    updated[index].remarks = remarks;
    setBulkAttendanceData(updated);
  };

  const getStatusChip = (status: string) => {
    const statusColors: Record<string, { color: string; background: string }> = {
      present: { color: 'white', background: 'green' },
      absent: { color: 'white', background: 'red' },
      late: { color: 'white', background: 'orange' },
      excused: { color: 'white', background: 'blue' }
    };
    
    const colors = statusColors[status] || { color: 'black', background: 'gray' };
    
    return (
      <Chip 
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        size="small"
        style={{ 
          backgroundColor: colors.background, 
          color: colors.color,
          fontWeight: 'bold' 
        }}
      />
    );
  };

  const statusOptions = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'excused', label: 'Excused' }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="p-6">
        <Typography variant="h4" gutterBottom className="mb-6">
          Attendance Management
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" className="mb-4" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Card className="mb-6">
          <CardHeader title="Filters" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Class</InputLabel>
                  <Select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value as string)}
                    label="Class"
                  >
                    <MenuItem value="">All Classes</MenuItem>
                    {classes.map(cls => (
                      <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Session</InputLabel>
                  <Select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value as string)}
                    label="Session"
                  >
                    <MenuItem value="">All Sessions</MenuItem>
                    {sessions.map(session => (
                      <MenuItem key={session.id} value={session.id}>{session.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as string)}
                    label="Status"
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    {statusOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <div className="flex gap-4 mb-6">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              resetNewAttendance();
              setShowAddForm(true);
            }}
            disabled={!selectedClass || !selectedSession}
          >
            Add Single Attendance
          </Button>

          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => {
              initializeBulkAttendance();
              setShowBulkForm(true);
            }}
            disabled={!selectedClass || !selectedSession || filteredStudents.length === 0}
          >
            Bulk Attendance Entry
          </Button>

          <Button 
            variant="outlined" 
            onClick={() => setShowSummary(true)}
            disabled={!selectedStudent && !selectedClass}
          >
            View Summary
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <CircularProgress />
          </div>
        ) : (
          <Card>
            <CardHeader 
              title={`Attendance Records (${filteredAttendances.length})`} 
              action={
                <TextField
                  label="Search Student"
                  variant="outlined"
                  size="small"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  select
                  SelectProps={{ native: true }}
                >
                  <option value="">All Students</option>
                  {filteredStudents.map(student => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                  ))}
                </TextField>
              }
            />
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Student</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Remarks</TableCell>
                      <TableCell>Recorded By</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAttendances.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No attendance records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAttendances.map((attendance) => {
                        const student = students.find(s => s.id === attendance.studentId);
                        const cls = classes.find(c => c.id === attendance.classId);
                        const recorder = currentUser?.role === 'admin' ? 
                          (students.find(s => s.id === attendance.recorder)?.name || 'Unknown') : 
                          'You';
                        
                        return (
                          <TableRow key={attendance.id}>
                            <TableCell>{new Date(attendance.date).toLocaleDateString()}</TableCell>
                            <TableCell>{student?.name || 'Unknown'}</TableCell>
                            <TableCell>{cls?.name || 'Unknown'}</TableCell>
                            <TableCell>{getStatusChip(attendance.status)}</TableCell>
                            <TableCell>{attendance.remarks || '-'}</TableCell>
                            <TableCell>{recorder}</TableCell>
                            <TableCell>
                              <Button 
                                size="small"
                                onClick={() => {
                                  setEditingAttendance({...attendance, id: attendance.id});
                                  setShowEditForm(true);
                                }}
                              >
                                Edit
                              </Button>
                              <Button 
                                size="small"
                                color="error"
                                onClick={() => handleDeleteAttendance(attendance.id)}
                                className="ml-2"
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Add Attendance Dialog */}
        <Dialog open={showAddForm} onClose={() => setShowAddForm(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Attendance Record</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} className="mt-4">
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Student</InputLabel>
                  <Select
                    value={newAttendance.student_id}
                    onChange={(e) => setNewAttendance({...newAttendance, student_id: e.target.value})}
                    label="Student"
                  >
                    {filteredStudents.map(student => (
                      <MenuItem key={student.id} value={student.id}>{student.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={newAttendance.date}
                  onChange={(e) => setNewAttendance({...newAttendance, date: e.target.value})}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newAttendance.status}
                    onChange={(e) => setNewAttendance({...newAttendance, status: e.target.value})}
                    label="Status"
                  >
                    {statusOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Remarks"
                  fullWidth
                  multiline
                  rows={3}
                  value={newAttendance.remarks}
                  onChange={(e) => setNewAttendance({...newAttendance, remarks: e.target.value})}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddForm(false)}>Cancel</Button>
            <Button onClick={handleAddAttendance} color="primary" disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Add Attendance'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bulk Attendance Dialog */}
        <Dialog open={showBulkForm} onClose={() => setShowBulkForm(false)} maxWidth="lg" fullWidth>
          <DialogTitle>Bulk Attendance Entry</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1" gutterBottom>
              Class: {classes.find(c => c.id === selectedClass)?.name || 'Unknown'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Date: {format(selectedDate || new Date(), 'MMMM dd, yyyy')}
            </Typography>
            <Typography variant="subtitle1" gutterBottom className="mb-4">
              Total Students: {bulkAttendanceData.length}
            </Typography>

            <TableContainer component={Paper} style={{ maxHeight: '500px', overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bulkAttendanceData.map((attendance, index) => {
                    const student = students.find(s => s.id === attendance.student_id);
                    return (
                      <TableRow key={index}>
                        <TableCell>{student?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          <Select
                            value={attendance.status}
                            onChange={(e) => updateBulkStatus(index, e.target.value)}
                            size="small"
                            style={{ minWidth: '120px' }}
                          >
                            {statusOptions.map(option => (
                              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            fullWidth
                            value={attendance.remarks}
                            onChange={(e) => updateBulkRemarks(index, e.target.value)}
                            placeholder="Add remarks..."
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowBulkForm(false)}>Cancel</Button>
            <Button onClick={handleBulkAddAttendance} color="primary" disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Save Bulk Attendance'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Attendance Dialog */}
        <Dialog open={showEditForm} onClose={() => setShowEditForm(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Attendance Record</DialogTitle>
          <DialogContent>
            {editingAttendance && (
              <Grid container spacing={2} className="mt-4">
                <Grid item xs={12}>
                  <Typography><strong>Student:</strong> {students.find(s => s.id === editingAttendance.studentId)?.name || 'Unknown'}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography><strong>Date:</strong> {new Date(editingAttendance.date).toLocaleDateString()}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editingAttendance.status}
                      onChange={(e) => setEditingAttendance({...editingAttendance, status: e.target.value})}
                      label="Status"
                    >
                      {statusOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Remarks"
                    fullWidth
                    multiline
                    rows={3}
                    value={editingAttendance.remarks || ''}
                    onChange={(e) => setEditingAttendance({...editingAttendance, remarks: e.target.value})}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowEditForm(false)}>Cancel</Button>
            <Button onClick={handleUpdateAttendance} color="primary" disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Update Attendance'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Summary Dialog */}
        <Dialog open={showSummary} onClose={() => setShowSummary(false)} maxWidth="md" fullWidth>
          <DialogTitle>Attendance Summary</DialogTitle>
          <DialogContent>
            {selectedStudent && studentSummary && (
              <div>
                <Typography variant="h6" gutterBottom>
                  Student: {students.find(s => s.id === selectedStudent)?.name || 'Unknown'}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Total Records: {studentSummary.total}
                </Typography>

                <Grid container spacing={2} className="mt-4">
                  {studentSummary.summary.map((item: any) => (
                    <Grid item xs={6} md={3} key={item.status}>
                      <Card>
                        <CardContent className="text-center">
                          <Typography variant="h4" component="div">
                            {item.count}
                          </Typography>
                          <Typography color="text.secondary">
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}

            {selectedClass && classSummary.length > 0 && (
              <div>
                <Typography variant="h6" gutterBottom>
                  Class: {classes.find(c => c.id === selectedClass)?.name || 'Unknown'}
                </Typography>

                <TableContainer component={Paper} className="mt-4">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Present</TableCell>
                        <TableCell>Absent</TableCell>
                        <TableCell>Late</TableCell>
                        <TableCell>Excused</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(classSummary.reduce((acc, item) => {
                        if (!acc[item.date]) {
                          acc[item.date] = { present: 0, absent: 0, late: 0, excused: 0 };
                        }
                        acc[item.date][item.status] = item.count;
                        return acc;
                      }, {} as Record<string, { present: number; absent: number; late: number; excused: number }>))
                        .map(([date, counts]) => {
                          const total = counts.present + counts.absent + counts.late + counts.excused;
                          return (
                            <TableRow key={date}>
                              <TableCell>{new Date(date).toLocaleDateString()}</TableCell>
                              <TableCell>{counts.present}</TableCell>
                              <TableCell>{counts.absent}</TableCell>
                              <TableCell>{counts.late}</TableCell>
                              <TableCell>{counts.excused}</TableCell>
                              <TableCell>{total}</TableCell>
                            </TableRow>
                          );
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSummary(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
}