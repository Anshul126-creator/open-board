<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\Center;
use App\Models\ClassModel;
use App\Models\Session;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AttendanceFactory extends Factory
{
    protected $model = Attendance::class;

    public function definition(): array
    {
        return [
            'student_id' => Student::factory(),
            'session_id' => Session::factory(),
            'class_id' => ClassModel::factory(),
            'center_id' => Center::factory(),
            'date' => $this->faker->date(),
            'status' => $this->faker->randomElement(Attendance::$statuses),
            'remarks' => $this->faker->optional()->sentence(),
            'recorded_by' => User::factory(),
        ];
    }

    public function present(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'present',
            ];
        });
    }

    public function absent(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'absent',
            ];
        });
    }

    public function late(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'late',
            ];
        });
    }

    public function excused(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'excused',
            ];
        });
    }

    public function forStudent(Student $student): Factory
    {
        return $this->state(function (array $attributes) use ($student) {
            return [
                'student_id' => $student->id,
                'center_id' => $student->center_id,
                'class_id' => $student->class_id,
                'session_id' => $student->session_id,
            ];
        });
    }

    public function forCenter(Center $center): Factory
    {
        return $this->state(function (array $attributes) use ($center) {
            return [
                'center_id' => $center->id,
            ];
        });
    }

    public function forClass(ClassModel $class): Factory
    {
        return $this->state(function (array $attributes) use ($class) {
            return [
                'class_id' => $class->id,
            ];
        });
    }

    public function forSession(Session $session): Factory
    {
        return $this->state(function (array $attributes) use ($session) {
            return [
                'session_id' => $session->id,
            ];
        });
    }

    public function recordedBy(User $user): Factory
    {
        return $this->state(function (array $attributes) use ($user) {
            return [
                'recorded_by' => $user->id,
            ];
        });
    }
}