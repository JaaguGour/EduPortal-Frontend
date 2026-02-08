import { Student, Teacher, ClassSection, Attendance, User } from "@/types";
import { mockStudents, mockTeachers, mockClasses, mockActivities, mockUsers } from "@/data/mockData";

// Simulate network delay
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// In-memory state for demo mutations
let students = [...mockStudents];
let teachers = [...mockTeachers];
let classes = [...mockClasses];

export const api = {
  // Auth
  async login(email: string, _password: string): Promise<User | null> {
    await delay(600);
    return mockUsers.find((u) => u.email === email) || mockUsers[0];
  },

  // Dashboard
  async getDashboardStats() {
    await delay();
    const totalStudents = students.length;
    const totalTeachers = teachers.length;
    const totalClasses = classes.length;
    const attendancePercent = 87;
    return { totalStudents, totalTeachers, totalClasses, attendancePercent };
  },

  async getRecentActivity() {
    await delay(300);
    return mockActivities;
  },

  // Students
  async getStudents(): Promise<Student[]> {
    await delay();
    return [...students];
  },

  async addStudent(student: Omit<Student, "id">): Promise<Student> {
    await delay();
    const newStudent = { ...student, id: `s${Date.now()}` };
    students.push(newStudent);
    return newStudent;
  },

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    await delay();
    const idx = students.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Student not found");
    students[idx] = { ...students[idx], ...data };
    return students[idx];
  },

  async deleteStudent(id: string): Promise<void> {
    await delay();
    students = students.filter((s) => s.id !== id);
  },

  // Teachers
  async getTeachers(): Promise<Teacher[]> {
    await delay();
    return [...teachers];
  },

  async addTeacher(teacher: Omit<Teacher, "id">): Promise<Teacher> {
    await delay();
    const newTeacher = { ...teacher, id: `t${Date.now()}` };
    teachers.push(newTeacher);
    return newTeacher;
  },

  async updateTeacher(id: string, data: Partial<Teacher>): Promise<Teacher> {
    await delay();
    const idx = teachers.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Teacher not found");
    teachers[idx] = { ...teachers[idx], ...data };
    return teachers[idx];
  },

  async deleteTeacher(id: string): Promise<void> {
    await delay();
    teachers = teachers.filter((t) => t.id !== id);
  },

  // Classes
  async getClasses(): Promise<ClassSection[]> {
    await delay();
    return [...classes];
  },

  async addClass(cls: Omit<ClassSection, "id">): Promise<ClassSection> {
    await delay();
    const newClass = { ...cls, id: `c${Date.now()}` };
    classes.push(newClass);
    return newClass;
  },

  async updateClass(id: string, data: Partial<ClassSection>): Promise<ClassSection> {
    await delay();
    const idx = classes.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Class not found");
    classes[idx] = { ...classes[idx], ...data };
    return classes[idx];
  },

  async deleteClass(id: string): Promise<void> {
    await delay();
    classes = classes.filter((c) => c.id !== id);
  },

  // Attendance
  async getStudentsByClass(grade: string, section: string): Promise<Student[]> {
    await delay();
    return students.filter((s) => s.class === grade && s.section === section);
  },

  async submitAttendance(records: Attendance[]): Promise<void> {
    await delay(600);
    console.log("Attendance submitted:", records);
  },
};
