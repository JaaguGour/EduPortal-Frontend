import { Student, Teacher, ClassSection, Activity, User } from "@/types";

export const mockUsers: User[] = [
  { id: "u1", name: "Dr. Priya Sharma", email: "admin@greenvalley.edu", role: "admin" },
  { id: "u2", name: "Rajesh Kumar", email: "rajesh@greenvalley.edu", role: "teacher" },
];

export const mockStudents: Student[] = [
  { id: "s1", name: "Aarav Mehta", rollNo: "101", class: "10", section: "A", parentPhone: "+91 98765 43210" },
  { id: "s2", name: "Diya Patel", rollNo: "102", class: "10", section: "A", parentPhone: "+91 98765 43211" },
  { id: "s3", name: "Vivaan Singh", rollNo: "103", class: "10", section: "B", parentPhone: "+91 98765 43212" },
  { id: "s4", name: "Ananya Gupta", rollNo: "201", class: "9", section: "A", parentPhone: "+91 98765 43213" },
  { id: "s5", name: "Kabir Joshi", rollNo: "202", class: "9", section: "A", parentPhone: "+91 98765 43214" },
  { id: "s6", name: "Ishita Reddy", rollNo: "203", class: "9", section: "B", parentPhone: "+91 98765 43215" },
  { id: "s7", name: "Reyansh Agarwal", rollNo: "301", class: "8", section: "A", parentPhone: "+91 98765 43216" },
  { id: "s8", name: "Myra Nair", rollNo: "302", class: "8", section: "A", parentPhone: "+91 98765 43217" },
  { id: "s9", name: "Arjun Verma", rollNo: "303", class: "8", section: "B", parentPhone: "+91 98765 43218" },
  { id: "s10", name: "Saanvi Desai", rollNo: "104", class: "10", section: "B", parentPhone: "+91 98765 43219" },
  { id: "s11", name: "Rudra Chopra", rollNo: "204", class: "9", section: "B", parentPhone: "+91 98765 43220" },
  { id: "s12", name: "Anika Bhatt", rollNo: "304", class: "8", section: "B", parentPhone: "+91 98765 43221" },
];

export const mockTeachers: Teacher[] = [
  { id: "t1", name: "Rajesh Kumar", subject: "Mathematics", assignedClass: "10-A" },
  { id: "t2", name: "Sunita Iyer", subject: "Science", assignedClass: "10-B" },
  { id: "t3", name: "Amit Saxena", subject: "English", assignedClass: "9-A" },
  { id: "t4", name: "Neha Kapoor", subject: "Hindi", assignedClass: "9-B" },
  { id: "t5", name: "Vikram Malhotra", subject: "Social Studies", assignedClass: "8-A" },
  { id: "t6", name: "Pooja Srinivasan", subject: "Computer Science", assignedClass: "8-B" },
];

export const mockClasses: ClassSection[] = [
  { id: "c1", grade: "10", section: "A", classTeacher: "Rajesh Kumar" },
  { id: "c2", grade: "10", section: "B", classTeacher: "Sunita Iyer" },
  { id: "c3", grade: "9", section: "A", classTeacher: "Amit Saxena" },
  { id: "c4", grade: "9", section: "B", classTeacher: "Neha Kapoor" },
  { id: "c5", grade: "8", section: "A", classTeacher: "Vikram Malhotra" },
  { id: "c6", grade: "8", section: "B", classTeacher: "Pooja Srinivasan" },
];

export const mockActivities: Activity[] = [
  { id: "a1", message: "New student Aarav Mehta enrolled in Class 10-A", timestamp: "2 minutes ago", type: "success" },
  { id: "a2", message: "Attendance marked for Class 9-A by Amit Saxena", timestamp: "15 minutes ago", type: "info" },
  { id: "a3", message: "Parent meeting scheduled for Class 10-B on Friday", timestamp: "1 hour ago", type: "warning" },
  { id: "a4", message: "New teacher Pooja Srinivasan added to staff", timestamp: "2 hours ago", type: "success" },
  { id: "a5", message: "Class 8-A attendance below 80% this week", timestamp: "3 hours ago", type: "warning" },
  { id: "a6", message: "Term examination schedule published", timestamp: "5 hours ago", type: "info" },
];

export const schoolInfo = {
  id: "sch1",
  name: "Green Valley International School",
};
