import { Datastore } from "@google-cloud/datastore";
import { Student } from "../shared/kinds";
import { generateId } from "../shared/idutilities";

// Initialize Datastore
const datastore = new Datastore();

export class StudentDAO {
  public static readonly STUDENT_KIND = "Student";

  public async addStudent(student: Student) {
    student.id = generateId();
    const entityKey = datastore.key([StudentDAO.STUDENT_KIND, student.id]);

    const entity = {
      key: entityKey,
      data: student
    };

    await datastore.save(entity);

    return student;
  }

  public async saveStudent(student: Student) {
    if (!student.id) {
      student.id = generateId();
    }
    const entityKey = datastore.key([StudentDAO.STUDENT_KIND, student.id]);

    const entity = {
      key: entityKey,
      data: student
    };

    await datastore.save(entity);

    return student;
  }

  public async getStudent(studentId: string) {
    const entityKey = datastore.key([StudentDAO.STUDENT_KIND, studentId]);
    const data = await datastore.get(entityKey);
    const student = data[0];
    return student;
  }

  public async getAllStudents() {
    const query = datastore.createQuery(StudentDAO.STUDENT_KIND);
    const data = await query.run();
    const students = data[0];
    return students as Student[];
  }
}

