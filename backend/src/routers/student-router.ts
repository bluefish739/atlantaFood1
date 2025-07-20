import express, { Request, Response, Router } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { Student } from "../shared/kinds";
import { studentDAO } from "../daos/dao-factory";
import { BaseRouter } from "./base-router";

export class StudentRouter extends BaseRouter {
  async addSampleStudent(req: Request, res: Response) {
    try {
      let student = new Student();
      student.name = "John Doe";
      student.email = "john@example.com";
      student.updatedAt = new Date();

      student = await studentDAO.saveStudent(student);
      logger.log("A new sample student added successfully! id=" + student.id);
      this.sendSuccessfulResponse(res, student);
    } catch (error: any) {
      logger.log("Failed to add a new sample student", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async addStudent(req: Request, res: Response) {
    const student = req.body as Student;
    try {
      if (!student) {
        logger.log("Student entity is not provided");
        this.sendClientErrorResponse(res, { success: false, message: "Student entity is not provided" }, 404);
        return;
      }
      if (student.id) {
        const existingStudent = await studentDAO.getStudent(student.id);
        if (!existingStudent) {
          this.sendClientErrorResponse(res, { success: false, message: "No student with id " + student.id + " was found" }, 404);
          return;
        }
      }
      student.updatedAt = new Date();
      const id = await studentDAO.saveStudent(student);
      logger.log("Student added successfully! id=" + id);
      this.sendSuccessfulResponse(res, student);
    } catch (error: any) {
      logger.log("Failed to add a student", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getAllStudents(req: Request, res: Response) {
    try {
      const students = await studentDAO.getAllStudents();
      this.sendSuccessfulResponse(res, students);
    } catch (error: any) {
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getStudent(req: Request, res: Response) {
    try {
      const studentId = req.params.studentId as string;
      if (!studentId) {
        this.sendClientErrorResponse(res, { success: false, message: "Missing student ID" }, 400);
        return;
      }
      const student = await studentDAO.getStudent(studentId);
      if (!student) {
        this.sendClientErrorResponse(res, { success: false, message: "Student not found " + studentId }, 404);
        return;
      }
      this.sendSuccessfulResponse(res, student);
    } catch (error: any) {
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  static buildRouter(): Router {
    const studentRouter = new StudentRouter();
    return express.Router()
      .get('/add-sample-student', authenticator([]), studentRouter.addSampleStudent.bind(studentRouter))
      .post('/student', authenticator([]), studentRouter.addStudent.bind(studentRouter))
      .get('/all', authenticator([]), studentRouter.getAllStudents.bind(studentRouter))
      .get('/student/:studentId', authenticator([]), studentRouter.getStudent.bind(studentRouter));
  }
}
