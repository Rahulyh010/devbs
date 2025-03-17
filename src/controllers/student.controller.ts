import { Request, Response } from "express";
import { z } from "zod";
import Student from "../models/student.model";
import { FormSchema } from "../routes/students.routes";

export const getStudents = async (req: Request, res: Response) => {
  const { phone, email, rollNo, limit, page } =
    req.query as unknown as FormSchema;

  const query: any = {
    ...(phone ? { Student_Phone: phone } : {}),
    ...(rollNo ? { "Student RollNo": { $regex: rollNo.trim() + "$" } } : {}),
    ...(email ? { "Student Email": email } : {}),
  };
  const pageNumber = Math.max(Number(page), 1);
  const pageSize = Math.max(Number(limit), 1);
  const skip = (pageNumber - 1) * pageSize;

  const students = await Student.find(query).skip(skip).limit(pageSize);

  if (!students.length) {
    return res.status(400).json({ message: "No students found" });
  }

  res.json({
    students,
    pagination: {
      currentPage: pageNumber,
      pageSize,
      totalRecords: await Student.countDocuments(query),
      totalPages: Math.ceil((await Student.countDocuments(query)) / pageSize),
    },
  });
};
