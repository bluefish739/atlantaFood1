import express, { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { Student } from "../shared/kinds";
import { StudentDAO } from "./student-dao";

const studentDAO = new StudentDAO();

export const studentRouter = express.Router();

studentRouter.get('/add-sample-student', authenticator, async (req: Request, res: Response) => {
  try {
    let student = new Student();
    student.name = "John Doe";
    student.email = "john@example.com";
    student.updatedAt = new Date();

    student = await studentDAO.saveStudent(student);
    logger.log("A new sample student added successfully! id=" + student.id);
    res.status(200).json(student);
  } catch (error: any) {
    logger.log("Failed to add a new sample student", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

studentRouter.post('/student', authenticator, async (req: Request, res: Response) => {
  const student = req.body as Student;
  try {
    if (!student) {
      logger.log("Student entity is not provided");
      res.status(404).json({ success: false, message: "Student entity is not provided" });
      return;
    }
    if (student.id) {
      const existingStudent = await studentDAO.getStudent(student.id);
      if (!existingStudent) {
        res.status(404).json({ success: false, message: "No student with id " + student.id + " was found" });
        return;
      }
    }
    student.updatedAt = new Date();
    const id = await studentDAO.saveStudent(student);
    logger.log("Student added successfully! id=" + id);
    res.status(200).json(student);
  } catch (error: any) {
    logger.log("Failed to add a student", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

studentRouter.get('/all', authenticator, async (req: Request, res: Response) => {
  try {
    const students = await studentDAO.getAllStudents();
    res.status(200).json(students);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

studentRouter.get('/student/:studentId', authenticator, async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId as string;
    if (!studentId) {
      res.status(400).json({ success: false, message: "Missing student ID" });
      return;
    }
    const student = await studentDAO.getStudent(studentId);
    if (!student) {
      res.status(404).json({ success: false, message: "Student not found " + studentId });
      return;
    }
    res.status(200).json(student);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
