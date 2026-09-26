export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  rollNumber?: string;
  block?: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type RoomStatus = 'available' | 'occupied' | 'booked' | 'maintenance';
export type RoomType = 'classroom' | 'lab' | 'conference' | 'auditorium' | 'library' | 'cafeteria';

export interface Room {
  _id: string;
  name: string;
  block: string;
  floor: number;
  capacity: number;
  current_status: RoomStatus;
  type: RoomType;
  amenities: string[];
  coordinates?: {
    x: number;
    y: number;
  };
  currentOccupancy?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  _id: string;
  room_id: Room | string;
  booked_by: User | string;
  start_time: string;
  end_time: string;
  purpose: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  attendee_count?: number;
  createdAt?: string;
}

export interface AttendanceRecord {
  student_id: User | string;
  marked_at: string;
  device_info?: string;
  method?: 'qr' | 'manual';
}

export interface AttendanceSession {
  _id: string;
  faculty_id: User | string;
  course_code: string;
  course_name: string;
  session_date: string;
  room_id?: Room | string;
  qr_token: string;
  is_active: boolean;
  records: AttendanceRecord[];
  expires_at?: string;
  createdAt?: string;
}

export type EmergencyType = 'medical' | 'fire' | 'security' | 'accident' | 'other';
export type EmergencyStatus = 'active' | 'responding' | 'resolved';

export interface EmergencySOS {
  _id: string;
  triggered_by: User | string;
  location?: {
    lat: number;
    lng: number;
    description: string;
  };
  block?: string;
  room_id?: Room | string;
  type: EmergencyType;
  status: EmergencyStatus;
  description?: string;
  responders?: (User | string)[];
  resolved_at?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CampusEvent {
  _id: string;
  title: string;
  description: string;
  category: 'academic' | 'cultural' | 'sports' | 'workshop' | 'club';
  organizer: User | string;
  room_id?: Room | string;
  start_time: string;
  end_time: string;
  rsvps: (User | string)[];
  max_capacity?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  banner_image?: string;
  createdAt?: string;
}

export interface LostFoundItem {
  _id: string;
  title: string;
  description: string;
  category: 'electronics' | 'id_cards' | 'books' | 'clothing' | 'keys' | 'accessories' | 'other';
  type: 'lost' | 'found';
  location: string;
  date_reported: string;
  reported_by: User | string;
  status: 'active' | 'claimed' | 'resolved';
  image_url?: string;
  contact_info?: string;
  potential_matches?: string[];
  createdAt?: string;
}

export interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: 'maintenance' | 'it' | 'cleanliness' | 'security' | 'hostel' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  submitted_by: User | string;
  assigned_to?: User | string;
  room_id?: Room | string;
  block?: string;
  resolution_notes?: string;
  createdAt?: string;
}

export type NotificationType =
  | 'emergency_sos'
  | 'booking_confirmed'
  | 'booking_conflict'
  | 'attendance_alert'
  | 'event_invite'
  | 'complaint_update'
  | 'lost_found_match'
  | 'general_announcement';

export interface CampusNotification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  recipient_role?: UserRole | 'all';
  recipient_id?: string;
  is_read: boolean;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  action_url?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface NavigationNode {
  id: string;
  name: string;
  block: string;
  floor: number;
  type: 'room' | 'staircase' | 'elevator' | 'restroom' | 'exit' | 'junction' | 'cafeteria';
  x: number;
  y: number;
  accessible: boolean;
  isEmergencyExit?: boolean;
}

export interface NavigationRoute {
  nodes: NavigationNode[];
  distanceMeters: number;
  estimatedMinutes: number;
  accessible: boolean;
  steps: string[];
}

export type StudyMaterialCategory = 'notes' | 'slides' | 'syllabus' | 'exam_paper' | 'lab_manual' | 'book' | 'assignment_solution';

export interface StudyMaterial {
  _id: string;
  title: string;
  subject: string;
  courseCode?: string;
  department: string;
  semester: number;
  category: StudyMaterialCategory;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  uploadedBy?: string | User;
  uploaderName?: string;
  uploaderRole?: string;
  upvotes?: string[];
  upvoteCount: number;
  tags?: string[];
  downloadsCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  role: UserRole;
  department?: string;
  xp: number;
  level: number;
  title: string;
  avatarColor?: string;
  streak?: number;
  badges?: string[];
}

export interface PerkItem {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'dining' | 'facility' | 'store' | 'event';
  cost: number;
  icon: string;
  tag?: string;
  expiryDays: number;
}

export interface RedeemedVoucher {
  id: string;
  perkId: string;
  perkTitle: string;
  category: string;
  voucherCode: string;
  cost: number;
  redeemedAt: string;
  expiresAt: string;
  status: 'active' | 'used';
}

export interface GamificationHistory {
  id: string;
  action: string;
  title: string;
  xp: number;
  type: 'earned' | 'spent';
  timestamp: string;
}

export interface GamificationProfile {
  xp: number;
  level: number;
  title: string;
  nextLevelXp: number;
  streak: number;
  history: GamificationHistory[];
  redeemedPerks: RedeemedVoucher[];
}

export interface AiMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  intent?: string;
  actions?: { label: string; link?: string; action?: string; question?: string }[];
  suggestions?: string[];
}

