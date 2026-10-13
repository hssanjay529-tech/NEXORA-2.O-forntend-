// =============================================================================
// NEXORA — Unified Frontend TypeScript Definitions
// Maps strictly to database_architecture.md and api_spec.md
// =============================================================================

export type UserRole = 'ADMIN' | 'FACULTY' | 'STUDENT' | 'DEAN';

export interface UserProfile {
  id: string;
  tenant_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone_number?: string;
  avatar_url?: string;
  is_active: boolean;
  roll_number?: string;
  employee_id?: string;
  department_name?: string;
  programme_name?: string;
  current_semester?: number;
  cgpa?: number;
}

export interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  is_active: boolean;
  min_attendance_pct: number;
}

export interface BackendHealth {
  online: boolean;
  message: string;
  version?: string;
  environment?: string;
}

// Admin Models
export interface DashboardKPIs {
  total_students: number;
  total_faculty: number;
  avg_attendance_pct: number;
  total_billed: number;
  total_collected: number;
  total_outstanding: number;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'ACTIVE' | 'INACTIVE';
  code: string; // Roll No or Employee ID
}

export interface TimetableSlot {
  id: string;
  course_code: string;
  course_name: string;
  faculty_name: string;
  room_number: string;
  day_of_week: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
  start_time: string;
  end_time: string;
}

export interface GradeApprovalBatch {
  id: string;
  course_code: string;
  course_name: string;
  faculty_name: string;
  submissions_count: number;
  avg_score: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submitted_at: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor_email: string;
  action: string;
  target_resource: string;
  ip_address: string;
  details: string;
}

// Faculty Models
export interface FacultyLecture {
  id: string;
  course_code: string;
  course_name: string;
  room_number: string;
  time_slot: string;
  student_count: number;
}

export interface AttendanceRecordItem {
  id: string;
  student_id: string;
  name: string;
  roll_number: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  attendance_pct: number;
}

export interface CourseMaterialItem {
  id: string;
  title: string;
  unit_number: number;
  file_name: string;
  file_size: string;
  uploaded_at: string;
  download_url: string;
}

export interface AssignmentItem {
  id: string;
  title: string;
  course_code: string;
  due_date: string;
  total_points: number;
  submissions_count: number;
  graded_count: number;
}

export interface GradebookRow {
  student_id: string;
  roll_number: string;
  student_name: string;
  internal_marks: number;
  midterm_marks: number;
  final_exam_marks: number;
  total_marks: number;
  letter_grade: string;
}

// Student Models
export interface CourseCatalogItem {
  id: string;
  code: string;
  name: string;
  credits: number;
  faculty_name: string;
  total_seats: number;
  enrolled_seats: number;
  is_enrolled: boolean;
}

export interface CourseAttendanceSummary {
  course_code: string;
  course_name: string;
  sessions_held: number;
  sessions_attended: number;
  percentage: number;
  is_eligible: boolean; // >= 75%
  classes_needed: number;
}

export interface StudentAssignment {
  id: string;
  title: string;
  course_name: string;
  due_date: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED';
  score?: number;
  max_score: number;
  feedback?: string;
}

export interface FeeInvoice {
  id: string;
  term_name: string;
  tuition_fee: number;
  lab_fee: number;
  library_fee: number;
  scholarship_discount: number;
  total_due: number;
  amount_paid: number;
  status: 'PAID' | 'PARTIAL' | 'UNPAID';
  due_date: string;
}

export interface ExamHallTicket {
  exam_id: string;
  exam_name: string;
  term_name: string;
  seat_number: string;
  is_eligible: boolean;
  issue_date: string;
  verification_code: string;
}

export interface GrievanceTicket {
  id: string;
  category: 'ACADEMIC' | 'FINANCE' | 'FACILITY' | 'EXAMINATION' | 'GENERAL';
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  created_at: string;
  last_reply?: string;
}

export interface PortalNotification {
  id: string;
  title: string;
  message: string;
  category: 'EXAM' | 'ATTENDANCE' | 'FEE' | 'SYSTEM';
  timestamp: string;
  read: boolean;
}

export interface PublicTenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo_url?: string;
}

export interface DeanDashboardData {
  school_name: string;
  dean_name: string;
  kpis: {
    total_departments: number;
    total_faculty: number;
    total_students: number;
    average_pass_rate: number;
    average_attendance: number;
    accreditation_compliance_pct: number;
  };
  department_stats: Array<{
    id: string;
    name: string;
    code: string;
    programmes_count: number;
    faculty_count: number;
    students_count: number;
    pass_rate: number;
  }>;
  pending_proposals: Array<{
    id: string;
    title: string;
    course_name: string;
    department: string;
    submitted_by: string;
    credits: number;
    created_at: string;
  }>;
}
