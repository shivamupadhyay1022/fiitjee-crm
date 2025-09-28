// --- Enums ---
export enum StudentStatus {
  Active = 'active',
  Inactive = 'inactive',
  Completed = 'completed',
}

export enum InquiryStatus {
  New = 'New',
  FollowUp = 'Follow-up',
  Enrolled = 'Enrolled',
  Dropped = 'Dropped',
}

export enum InquirySource {
  WalkIn = 'Walk-in',
  Website = 'Website',
  Referral = 'Referral',
  SocialMedia = 'Social Media',
  Other = 'Other',
}

export enum ProgramStatus {
    Active = 'active',
    Inactive = 'inactive',
}

export enum BatchStatus {
    Active = 'active',
    Inactive = 'inactive',
}

// --- Interfaces ---
export interface Employee {
  id: string;
  name: string;
}

export interface Program {
  id: string;
  name: string;
  category: string;
  code: string;
  description: string;
  duration: string;
  fee: number;
  status: ProgramStatus;
  targetAudience: string; // e.g. "6", "10", "12"
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  id: string;
  fullName: string;
  enrollmentId: string;
  dob: string;
  className: string; // `class` in firebase
  school: string;
  programId: string;
  batchId: string;
  medium: string;
  board: string;
  phone: string;
  email: string;
  address: string;
  status: StudentStatus;
  createdAt?: string;
  updatedAt?: string;
  employeeId?: string; // To track who enrolled them
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  programOfInterestId: string;
  employeeId: string;
  status: InquiryStatus;
  source: InquirySource;
  notes?: string;
  inquiryDate: string;
  followUpDate?: string;
}

export interface Potential extends Inquiry {
  remark: string;
}

export interface Batch {
    id: string;
    name: string;
    code: string;
    remarks: string;
    status: BatchStatus;
    studentCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ExamRecord {
    air: number | string;
    name: string;
    program: string;
    score: string;
    url: string;
}

export interface ExamResults {
    [examName: string]: {
        [year: string]: ExamRecord[];
    };
}

export type View = 'dashboard' | 'students' | 'inquiries' | 'programs' | 'potentials' | 'batches' | 'results' | 'profile';