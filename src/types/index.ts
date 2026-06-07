// ---- Enums ----
export type Role = 'Admin' | 'Lead' | 'Volunteer';
export type TaskStatus = 'Pending Triage' | 'Assigned' | 'In Review' | 'Completed';
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
  external_link: string | null;
  file_path: string | null;
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

export interface TaskUpdate {
  id: string;
  task_id: string;
  user_id: string;
  new_status: TaskStatus | null;
  comment: string | null;
  created_at: string;
  profiles?: { full_name: string } | null;
}

// ---- Volunteer Applications ----
export type VolunteerApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface VolunteerApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  preferred_department_id: string | null;
  assigned_department_id: string | null;
  status: VolunteerApplicationStatus;
  created_at: string;
}

// ---- Blog Pulse ----
export type BlogCategory = 'Update' | 'Devotion' | 'Story' | 'Events' | 'Culture';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  category: BlogCategory;
  author_name: string;
  cover_image_url: string | null;
  video_url: string | null;
  video_type: 'youtube' | 'upload' | null;
  is_featured: boolean;
  event_date: string | null;
  registration_open: boolean;
  capacity: number | null;
  published_at: string;
  created_at: string;
}

export interface EventRegistration {
  id: string;
  post_id: string;
  full_name: string;
  email: string;
  phone: string | null;
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
