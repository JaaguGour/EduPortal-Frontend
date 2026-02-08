export interface School {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  section: string;
  parentPhone: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  assignedClass: string;
}

export interface ClassSection {
  id: string;
  grade: string;
  section: string;
  classTeacher: string;
}

export interface Attendance {
  studentId: string;
  date: string;
  status: "PRESENT" | "ABSENT";
}

export type UserRole = "admin" | "teacher";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Activity {
  id: string;
  message: string;
  timestamp: string;
  type: "info" | "success" | "warning";
}
