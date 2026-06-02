// ---- Enums ----
export type Role = 'Admin' | 'Lead' | 'Volunteer';
export type TaskStatus = 'Draft' | 'Pending Triage' | 'Assigned' | 'In Review' | 'Completed';
export type RequestStatus = 'Pending' | 'Approved';
export type TemplateFieldType = 'text' | 'date' | 'select' | 'textarea';

// ---- Core entities ----
export interface Profile {
  id: string;
  full_name: string;
  role: Role;
  department_id: string | null;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Lifehouse {
  id: string;
  name: string;
  location: string | null;
  meeting_time: string | null;
  lead_user_id: string | null;
  created_at: string;
}

export interface Member {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  lifehouse_id: string | null;
  join_date: string;
  created_at: string;
}

export interface LifehouseRequest {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  address_area: string;
  status: RequestStatus;
  created_at: string;
}

export interface AttendanceLog {
  id: string;
  member_id: string;
  lifehouse_id: string;
  meeting_date: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  department_id: string | null;
  requester_id: string;
  assignee_id: string | null;
  status: TaskStatus;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface TemplateField {
  name: string;
  label: string;
  type: TemplateFieldType;
  options?: string[];
  required: boolean;
}

export interface TaskTemplate {
  id: string;
  department_id: string | null;
  template_name: string;
  required_fields: TemplateField[];
  created_at: string;
}

export interface Space {
  id: string;
  department_id: string | null;
  title: string;
  external_link: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: string;
  action_link: string | null;
  is_read: boolean;
  created_at: string;
}

// ---- View types ----
export interface LeaderboardEntry {
  id: string;
  full_name: string;
  completed_count: number;
}

export interface RetentionAlert {
  id: string;
  full_name: string;
  phone: string | null;
  lifehouse_id: string;
  attendance_count: number;
}
