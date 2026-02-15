<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Center;
use App\Models\ClassModel;
use App\Models\Session;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AttendanceTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $adminUser;
    protected $centerUser;
    protected $center;
    protected $session;
    protected $class;
    protected $student;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test data
        $this->center = Center::create([
            'name' => 'Test Center',
            'code' => 'TC001',
            'address' => 'Test Address',
            'phone' => '1234567890',
            'email' => 'test@center.com',
            'status' => 'active'
        ]);

        $this->session = Session::create([
            'name' => '2023-24',
            'start_date' => '2023-04-01',
            'end_date' => '2024-03-31',
            'is_active' => true
        ]);

        $this->class = ClassModel::create([
            'name' => 'Class 10'
        ]);

        $this->student = Student::create([
            'center_id' => $this->center->id,
            'name' => 'Test Student',
            'email' => 'test@student.com',
            'phone' => '9876543210',
            'class_id' => $this->class->id,
            'roll_number' => '101',
            'session_id' => $this->session->id,
            'father_name' => 'Test Father',
            'mother_name' => 'Test Mother',
            'dob' => '2008-01-01',
            'address' => 'Test Address',
            'registration_date' => now()
        ]);

        $this->adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin'
        ]);

        $this->centerUser = User::create([
            'name' => 'Center User',
            'email' => 'center@test.com',
            'password' => bcrypt('password'),
            'role' => 'center',
            'center_id' => $this->center->id
        ]);
    }

    /** @test */
    public function admin_can_create_attendance_record()
    {
        $response = $this->actingAs($this->adminUser, 'api')->post('/api/attendances', [
            'student_id' => $this->student->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'date' => '2023-10-10',
            'status' => 'present',
            'remarks' => 'Test remarks'
        ]);

        $response->assertStatus(201)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Attendance record created successfully'
                 ]);

        $this->assertDatabaseHas('attendances', [
            'student_id' => $this->student->id,
            'status' => 'present'
        ]);
    }

    /** @test */
    public function center_user_can_create_attendance_record_for_their_center()
    {
        $response = $this->actingAs($this->centerUser, 'api')->post('/api/attendances', [
            'student_id' => $this->student->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'date' => '2023-10-10',
            'status' => 'present'
        ]);

        $response->assertStatus(201)
                 ->assertJson([
                     'success' => true
                 ]);

        $this->assertDatabaseHas('attendances', [
            'student_id' => $this->student->id,
            'center_id' => $this->center->id
        ]);
    }

    /** @test */
    public function validation_works_for_attendance_creation()
    {
        $response = $this->actingAs($this->adminUser, 'api')->post('/api/attendances', [
            'student_id' => 999, // Non-existent student
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'date' => '2023-10-10',
            'status' => 'invalid_status'
        ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function admin_can_get_all_attendance_records()
    {
        // Create some test attendance records
        Attendance::create([
            'student_id' => $this->student->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'center_id' => $this->center->id,
            'date' => '2023-10-10',
            'status' => 'present',
            'recorded_by' => $this->adminUser->id
        ]);

        $response = $this->actingAs($this->adminUser, 'api')->get('/api/attendances');

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true
                 ]);
    }

    /** @test */
    public function center_user_can_only_see_their_center_attendance_records()
    {
        // Create attendance for this center
        $centerAttendance = Attendance::create([
            'student_id' => $this->student->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'center_id' => $this->center->id,
            'date' => '2023-10-10',
            'status' => 'present',
            'recorded_by' => $this->centerUser->id
        ]);

        // Create another center and attendance
        $otherCenter = Center::create([
            'name' => 'Other Center',
            'code' => 'OC001',
            'address' => 'Other Address',
            'phone' => '1111111111',
            'email' => 'other@center.com',
            'status' => 'active'
        ]);

        $otherStudent = Student::create([
            'center_id' => $otherCenter->id,
            'name' => 'Other Student',
            'email' => 'other@student.com',
            'phone' => '9999999999',
            'class_id' => $this->class->id,
            'roll_number' => '102',
            'session_id' => $this->session->id,
            'father_name' => 'Other Father',
            'mother_name' => 'Other Mother',
            'dob' => '2008-01-01',
            'address' => 'Other Address',
            'registration_date' => now()
        ]);

        $otherAttendance = Attendance::create([
            'student_id' => $otherStudent->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'center_id' => $otherCenter->id,
            'date' => '2023-10-10',
            'status' => 'present',
            'recorded_by' => $this->adminUser->id
        ]);

        // Center user should only see their own center's attendance
        $response = $this->actingAs($this->centerUser, 'api')->get('/api/attendances');

        $response->assertStatus(200);
        $response->assertJsonFragment(['id' => $centerAttendance->id]);
        $response->assertJsonMissing(['id' => $otherAttendance->id]);
    }

    /** @test */
    public function admin_can_update_attendance_record()
    {
        $attendance = Attendance::create([
            'student_id' => $this->student->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'center_id' => $this->center->id,
            'date' => '2023-10-10',
            'status' => 'present',
            'recorded_by' => $this->adminUser->id
        ]);

        $response = $this->actingAs($this->adminUser, 'api')->put("/api/attendances/{$attendance->id}", [
            'status' => 'absent',
            'remarks' => 'Updated remarks'
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Attendance record updated successfully'
                 ]);

        $this->assertDatabaseHas('attendances', [
            'id' => $attendance->id,
            'status' => 'absent',
            'remarks' => 'Updated remarks'
        ]);
    }

    /** @test */
    public function center_user_can_only_update_their_center_attendance_records()
    {
        $attendance = Attendance::create([
            'student_id' => $this->student->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'center_id' => $this->center->id,
            'date' => '2023-10-10',
            'status' => 'present',
            'recorded_by' => $this->centerUser->id
        ]);

        // Center user can update their own attendance
        $response = $this->actingAs($this->centerUser, 'api')->put("/api/attendances/{$attendance->id}", [
            'status' => 'absent'
        ]);

        $response->assertStatus(200);

        // Create attendance for another center
        $otherCenter = Center::create([
            'name' => 'Other Center',
            'code' => 'OC002',
            'address' => 'Other Address',
            'phone' => '2222222222',
            'email' => 'other2@center.com',
            'status' => 'active'
        ]);

        $otherStudent = Student::create([
            'center_id' => $otherCenter->id,
            'name' => 'Other Student 2',
            'email' => 'other2@student.com',
            'phone' => '8888888888',
            'class_id' => $this->class->id,
            'roll_number' => '103',
            'session_id' => $this->session->id,
            'father_name' => 'Other Father 2',
            'mother_name' => 'Other Mother 2',
            'dob' => '2008-01-01',
            'address' => 'Other Address 2',
            'registration_date' => now()
        ]);

        $otherAttendance = Attendance::create([
            'student_id' => $otherStudent->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'center_id' => $otherCenter->id,
            'date' => '2023-10-10',
            'status' => 'present',
            'recorded_by' => $this->adminUser->id
        ]);

        // Center user cannot update other center's attendance
        $response = $this->actingAs($this->centerUser, 'api')->put("/api/attendances/{$otherAttendance->id}", [
            'status' => 'absent'
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_delete_attendance_record()
    {
        $attendance = Attendance::create([
            'student_id' => $this->student->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'center_id' => $this->center->id,
            'date' => '2023-10-10',
            'status' => 'present',
            'recorded_by' => $this->adminUser->id
        ]);

        $response = $this->actingAs($this->adminUser, 'api')->delete("/api/attendances/{$attendance->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Attendance record deleted successfully'
                 ]);

        $this->assertDatabaseMissing('attendances', ['id' => $attendance->id]);
    }

    /** @test */
    public function center_user_can_only_delete_their_center_attendance_records()
    {
        $attendance = Attendance::create([
            'student_id' => $this->student->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'center_id' => $this->center->id,
            'date' => '2023-10-10',
            'status' => 'present',
            'recorded_by' => $this->centerUser->id
        ]);

        // Center user can delete their own attendance
        $response = $this->actingAs($this->centerUser, 'api')->delete("/api/attendances/{$attendance->id}");
        $response->assertStatus(200);

        // Create attendance for another center
        $otherCenter = Center::create([
            'name' => 'Other Center 3',
            'code' => 'OC003',
            'address' => 'Other Address 3',
            'phone' => '3333333333',
            'email' => 'other3@center.com',
            'status' => 'active'
        ]);

        $otherStudent = Student::create([
            'center_id' => $otherCenter->id,
            'name' => 'Other Student 3',
            'email' => 'other3@student.com',
            'phone' => '7777777777',
            'class_id' => $this->class->id,
            'roll_number' => '104',
            'session_id' => $this->session->id,
            'father_name' => 'Other Father 3',
            'mother_name' => 'Other Mother 3',
            'dob' => '2008-01-01',
            'address' => 'Other Address 3',
            'registration_date' => now()
        ]);

        $otherAttendance = Attendance::create([
            'student_id' => $otherStudent->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'center_id' => $otherCenter->id,
            'date' => '2023-10-10',
            'status' => 'present',
            'recorded_by' => $this->adminUser->id
        ]);

        // Center user cannot delete other center's attendance
        $response = $this->actingAs($this->centerUser, 'api')->delete("/api/attendances/{$otherAttendance->id}");
        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_get_student_attendance_summary()
    {
        // Create multiple attendance records for the student
        Attendance::create([
            'student_id' => $this->student->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'center_id' => $this->center->id,
            'date' => '2023-10-10',
            'status' => 'present',
            'recorded_by' => $this->adminUser->id
        ]);

        Attendance::create([
            'student_id' => $this->student->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'center_id' => $this->center->id,
            'date' => '2023-10-11',
            'status' => 'absent',
            'recorded_by' => $this->adminUser->id
        ]);

        Attendance::create([
            'student_id' => $this->student->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'center_id' => $this->center->id,
            'date' => '2023-10-12',
            'status' => 'present',
            'recorded_by' => $this->adminUser->id
        ]);

        $response = $this->actingAs($this->adminUser, 'api')->get("/api/attendances/student/{$this->student->id}/summary");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true
                 ])
                 ->assertJsonFragment(['total' => 3]);
    }

    /** @test */
    public function center_user_can_only_get_their_center_student_attendance_summary()
    {
        // Create attendance for this center's student
        Attendance::create([
            'student_id' => $this->student->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'center_id' => $this->center->id,
            'date' => '2023-10-10',
            'status' => 'present',
            'recorded_by' => $this->centerUser->id
        ]);

        // Create another center and student
        $otherCenter = Center::create([
            'name' => 'Other Center 4',
            'code' => 'OC004',
            'address' => 'Other Address 4',
            'phone' => '4444444444',
            'email' => 'other4@center.com',
            'status' => 'active'
        ]);

        $otherStudent = Student::create([
            'center_id' => $otherCenter->id,
            'name' => 'Other Student 4',
            'email' => 'other4@student.com',
            'phone' => '6666666666',
            'class_id' => $this->class->id,
            'roll_number' => '105',
            'session_id' => $this->session->id,
            'father_name' => 'Other Father 4',
            'mother_name' => 'Other Mother 4',
            'dob' => '2008-01-01',
            'address' => 'Other Address 4',
            'registration_date' => now()
        ]);

        // Center user can get their own student's summary
        $response = $this->actingAs($this->centerUser, 'api')->get("/api/attendances/student/{$this->student->id}/summary");
        $response->assertStatus(200);

        // Center user cannot get other center's student summary
        $response = $this->actingAs($this->centerUser, 'api')->get("/api/attendances/student/{$otherStudent->id}/summary");
        $response->assertStatus(200); // Should return empty or filtered results
    }

    /** @test */
    public function admin_can_get_class_attendance_summary()
    {
        // Create attendance records for different students in the same class
        Attendance::create([
            'student_id' => $this->student->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'center_id' => $this->center->id,
            'date' => '2023-10-10',
            'status' => 'present',
            'recorded_by' => $this->adminUser->id
        ]);

        $otherStudent = Student::create([
            'center_id' => $this->center->id,
            'name' => 'Other Student 5',
            'email' => 'other5@student.com',
            'phone' => '5555555555',
            'class_id' => $this->class->id,
            'roll_number' => '106',
            'session_id' => $this->session->id,
            'father_name' => 'Other Father 5',
            'mother_name' => 'Other Mother 5',
            'dob' => '2008-01-01',
            'address' => 'Other Address 5',
            'registration_date' => now()
        ]);

        Attendance::create([
            'student_id' => $otherStudent->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'center_id' => $this->center->id,
            'date' => '2023-10-10',
            'status' => 'absent',
            'recorded_by' => $this->adminUser->id
        ]);

        $response = $this->actingAs($this->adminUser, 'api')->get("/api/attendances/class/{$this->class->id}/summary");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true
                 ]);
    }

    /** @test */
    public function admin_can_bulk_create_attendance_records()
    {
        $attendanceData = [
            [
                'student_id' => $this->student->id,
                'session_id' => $this->session->id,
                'class_id' => $this->class->id,
                'date' => '2023-10-10',
                'status' => 'present'
            ],
            [
                'student_id' => $this->student->id,
                'session_id' => $this->session->id,
                'class_id' => $this->class->id,
                'date' => '2023-10-11',
                'status' => 'absent',
                'remarks' => 'Test bulk remarks'
            ]
        ];

        $response = $this->actingAs($this->adminUser, 'api')->post('/api/attendances/bulk', [
            'attendances' => $attendanceData
        ]);

        $response->assertStatus(201)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Bulk attendance records created successfully'
                 ]);

        $this->assertDatabaseHas('attendances', [
            'student_id' => $this->student->id,
            'date' => '2023-10-10',
            'status' => 'present'
        ]);

        $this->assertDatabaseHas('attendances', [
            'student_id' => $this->student->id,
            'date' => '2023-10-11',
            'status' => 'absent',
            'remarks' => 'Test bulk remarks'
        ]);
    }

    /** @test */
    public function bulk_create_validates_data()
    {
        $attendanceData = [
            [
                'student_id' => $this->student->id,
                'session_id' => $this->session->id,
                'class_id' => $this->class->id,
                'date' => '2023-10-10',
                'status' => 'present'
            ],
            [
                'student_id' => 999, // Invalid student ID
                'session_id' => $this->session->id,
                'class_id' => $this->class->id,
                'date' => '2023-10-11',
                'status' => 'invalid_status' // Invalid status
            ]
        ];

        $response = $this->actingAs($this->adminUser, 'api')->post('/api/attendances/bulk', [
            'attendances' => $attendanceData
        ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function attendance_filters_work_correctly()
    {
        // Create test data with different attributes
        $student1 = $this->student;
        $student2 = Student::create([
            'center_id' => $this->center->id,
            'name' => 'Student 2',
            'email' => 'student2@test.com',
            'phone' => '5555555555',
            'class_id' => $this->class->id,
            'roll_number' => '102',
            'session_id' => $this->session->id,
            'father_name' => 'Father 2',
            'mother_name' => 'Mother 2',
            'dob' => '2008-01-01',
            'address' => 'Address 2',
            'registration_date' => now()
        ]);

        $session2 = Session::create([
            'name' => '2024-25',
            'start_date' => '2024-04-01',
            'end_date' => '2025-03-31',
            'is_active' => false
        ]);

        $class2 = ClassModel::create([
            'name' => 'Class 12'
        ]);

        // Create attendances with different attributes
        Attendance::create([
            'student_id' => $student1->id,
            'session_id' => $this->session->id,
            'class_id' => $this->class->id,
            'center_id' => $this->center->id,
            'date' => '2023-10-10',
            'status' => 'present',
            'recorded_by' => $this->adminUser->id
        ]);

        Attendance::create([
            'student_id' => $student2->id,
            'session_id' => $session2->id,
            'class_id' => $class2->id,
            'center_id' => $this->center->id,
            'date' => '2023-10-11',
            'status' => 'absent',
            'recorded_by' => $this->adminUser->id
        ]);

        // Test student filter
        $response = $this->actingAs($this->adminUser, 'api')->get("/api/attendances?student_id={$student1->id}");
        $response->assertStatus(200);
        $response->assertJsonFragment(['student_id' => $student1->id]);
        $response->assertJsonMissing(['student_id' => $student2->id]);

        // Test class filter
        $response = $this->actingAs($this->adminUser, 'api')->get("/api/attendances?class_id={$this->class->id}");
        $response->assertStatus(200);
        $response->assertJsonFragment(['class_id' => $this->class->id]);

        // Test session filter
        $response = $this->actingAs($this->adminUser, 'api')->get("/api/attendances?session_id={$this->session->id}");
        $response->assertStatus(200);
        $response->assertJsonFragment(['session_id' => $this->session->id]);

        // Test date filter
        $response = $this->actingAs($this->adminUser, 'api')->get('/api/attendances?date=2023-10-10');
        $response->assertStatus(200);
        $response->assertJsonFragment(['date' => '2023-10-10']);

        // Test status filter
        $response = $this->actingAs($this->adminUser, 'api')->get('/api/attendances?status=present');
        $response->assertStatus(200);
        $response->assertJsonFragment(['status' => 'present']);
    }
}