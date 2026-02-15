<?php

namespace Tests\Unit;

use App\Models\Attendance;
use App\Models\Center;
use App\Models\ClassModel;
use App\Models\Session;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AttendanceModelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function attendance_model_has_correct_fillable_fields()
    {
        $attendance = new Attendance();
        $expectedFillable = [
            'student_id',
            'session_id',
            'class_id',
            'center_id',
            'date',
            'status',
            'remarks',
            'recorded_by'
        ];

        $this->assertEquals($expectedFillable, $attendance->getFillable());
    }

    /** @test */
    public function attendance_model_has_correct_status_constants()
    {
        $this->assertEquals('present', Attendance::STATUS_PRESENT);
        $this->assertEquals('absent', Attendance::STATUS_ABSENT);
        $this->assertEquals('late', Attendance::STATUS_LATE);
        $this->assertEquals('excused', Attendance::STATUS_EXCUSED);
    }

    /** @test */
    public function attendance_model_has_correct_statuses_array()
    {
        $expectedStatuses = [
            Attendance::STATUS_PRESENT,
            Attendance::STATUS_ABSENT,
            Attendance::STATUS_LATE,
            Attendance::STATUS_EXCUSED
        ];

        $this->assertEquals($expectedStatuses, Attendance::$statuses);
    }

    /** @test */
    public function attendance_belongs_to_student()
    {
        $attendance = Attendance::factory()->create();
        
        $this->assertInstanceOf(Student::class, $attendance->student);
        $this->assertEquals($attendance->student_id, $attendance->student->id);
    }

    /** @test */
    public function attendance_belongs_to_session()
    {
        $attendance = Attendance::factory()->create();
        
        $this->assertInstanceOf(Session::class, $attendance->session);
        $this->assertEquals($attendance->session_id, $attendance->session->id);
    }

    /** @test */
    public function attendance_belongs_to_class()
    {
        $attendance = Attendance::factory()->create();
        
        $this->assertInstanceOf(ClassModel::class, $attendance->class);
        $this->assertEquals($attendance->class_id, $attendance->class->id);
    }

    /** @test */
    public function attendance_belongs_to_center()
    {
        $attendance = Attendance::factory()->create();
        
        $this->assertInstanceOf(Center::class, $attendance->center);
        $this->assertEquals($attendance->center_id, $attendance->center->id);
    }

    /** @test */
    public function attendance_belongs_to_recorder()
    {
        $attendance = Attendance::factory()->create();
        
        $this->assertInstanceOf(User::class, $attendance->recorder);
        $this->assertEquals($attendance->recorded_by, $attendance->recorder->id);
    }

    /** @test */
    public function attendance_date_is_cast_to_date()
    {
        $attendance = Attendance::factory()->create([
            'date' => '2023-10-15'
        ]);

        $this->assertInstanceOf(\DateTime::class, $attendance->date);
        $this->assertEquals('2023-10-15', $attendance->date->format('Y-m-d'));
    }

    /** @test */
    public function attendance_can_be_created_with_valid_data()
    {
        $center = Center::factory()->create();
        $session = Session::factory()->create();
        $class = ClassModel::factory()->create();
        $student = Student::factory()->create([
            'center_id' => $center->id,
            'class_id' => $class->id,
            'session_id' => $session->id
        ]);
        $user = User::factory()->create();

        $attendance = Attendance::create([
            'student_id' => $student->id,
            'session_id' => $session->id,
            'class_id' => $class->id,
            'center_id' => $center->id,
            'date' => '2023-10-15',
            'status' => 'present',
            'remarks' => 'Test remarks',
            'recorded_by' => $user->id
        ]);

        $this->assertDatabaseHas('attendances', [
            'id' => $attendance->id,
            'student_id' => $student->id,
            'status' => 'present'
        ]);
    }

    /** @test */
    public function attendance_default_status_is_present()
    {
        $center = Center::factory()->create();
        $session = Session::factory()->create();
        $class = ClassModel::factory()->create();
        $student = Student::factory()->create([
            'center_id' => $center->id,
            'class_id' => $class->id,
            'session_id' => $session->id
        ]);
        $user = User::factory()->create();

        $attendance = Attendance::create([
            'student_id' => $student->id,
            'session_id' => $session->id,
            'class_id' => $class->id,
            'center_id' => $center->id,
            'date' => '2023-10-15',
            'recorded_by' => $user->id
            // status is not provided
        ]);

        $this->assertEquals('present', $attendance->status);
    }

    /** @test */
    public function attendance_can_be_updated()
    {
        $attendance = Attendance::factory()->create([
            'status' => 'present',
            'remarks' => 'Original remarks'
        ]);

        $attendance->update([
            'status' => 'absent',
            'remarks' => 'Updated remarks'
        ]);

        $this->assertDatabaseHas('attendances', [
            'id' => $attendance->id,
            'status' => 'absent',
            'remarks' => 'Updated remarks'
        ]);
    }

    /** @test */
    public function attendance_can_be_deleted()
    {
        $attendance = Attendance::factory()->create();
        $attendanceId = $attendance->id;

        $attendance->delete();

        $this->assertDatabaseMissing('attendances', ['id' => $attendanceId]);
    }

    /** @test */
    public function attendance_has_timestamps()
    {
        $attendance = Attendance::factory()->create();

        $this->assertNotNull($attendance->created_at);
        $this->assertNotNull($attendance->updated_at);
        $this->assertInstanceOf(\DateTime::class, $attendance->created_at);
        $this->assertInstanceOf(\DateTime::class, $attendance->updated_at);
    }
}