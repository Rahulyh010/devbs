import axios from "axios";
import { Request, Response } from "express";
import env from "../utils/env";
import { OTPModel } from "../models/otp.model";
import { FormSchema } from "../routes/form/form.routes";
import Student from "../models/student.model";
import { Session } from "../models/session.model";
import { QuestionModel } from "../models/question.model";

const SMARTPING_API_URL = "https://backend.api-wa.co/campaign/smartping/api/v2";
const SMARTPING_API_KEY = env.SMARTPING_API_KEY;

export const sendPhoneOTP = async (req: Request, res: Response) => {
  const { phone, countryCode, email, rollNo } =
    req.body as unknown as FormSchema;

  if (!phone) {
    return res.status(400).json({ message: "phone is required" });
  }

  // const student = await Student.findOne({ "Student RollNo": rollNo });
  // if (!student) {
  //   return res.status(400).json({ message: "Student not found" });
  // }

  let student: any = await Student.findOne({
    "Student RollNo": rollNo,
    // Student_Phone: phone,
  });

  const l = true;

  // if (l) {
  //   console.log(student);
  //   const l = rollNo.length;
  //   const st = student.toObject();

  //   const currentRollNo = String(st["Student RollNo"])
  //     .split("")
  //     .reverse()
  //     .join("");
  //   if (currentRollNo.slice(0, l).split("").reverse().join("") === rollNo) {
  //     console.log(
  //       currentRollNo.slice(0, l).split("").reverse().join(""),
  //       rollNo,
  //       "true"
  //     );
  //   } else {
  //     console.log(
  //       currentRollNo.slice(0, l).split("").reverse().join(""),
  //       rollNo,
  //       "false"
  //     );
  //   }

  //   return;
  // }

  if (!student) {
    const rollNoInput = rollNo.trim(); // Ensure no extra spaces
    let allStudents = await Student.find({});

    // Convert Mongoose documents to plain objects using map
    allStudents = allStudents.map((s) => s.toObject());

    // Use endsWith to check if the roll number ends with the input
    student = allStudents.find((s) =>
      String(s["Student RollNo"]).endsWith(rollNoInput)
    );

    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }
    // const l = rollNo.length;

    // let allStudents = await Student.find({});

    // allStudents = allStudents.map((s) => s.toObject());

    // student = allStudents.find((s) => {
    //   const currentRollNo = String(s["Student RollNo"])
    //     .split("")
    //     .reverse()
    //     .join("");
    //   return currentRollNo.slice(0, l).split("").reverse().join("") === rollNo;
    // });

    // if (!student) {
    //   return res.status(400).json({ message: "Student not found" });
    // }
  }
  student = Student.hydrate(student);
  if (student.attempted) {
    return res
      .status(400)
      .json({ message: "You have already attempted this Quiz" });
  }

  student["Student_Phone"] = phone;
  student["Student_Email"] = email;
  await student.save();

  // Prevent multiple exam sessions: Check if a session is already active for the student
  const existingSession = await Session.findOne({ student: student._id });
  if (existingSession) {
    return res
      .status(400)
      .json({ message: "An exam session is already active for this student" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`Generated OTP: ${otp}`); // Debugging

  try {
    await OTPModel.findOneAndUpdate(
      { countryCode, phone },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    const response = await axios.post(
      SMARTPING_API_URL,
      {
        apiKey: SMARTPING_API_KEY,
        campaignName: "Form OTP Verification",
        destination: phone,
        userName: "Bskilling",
        templateParams: [`${otp}`],
        source: "new-landing-page form",
        media: {
          url: "https://whatsapp-media-library.s3.ap-south-1.amazonaws.com/IMAGE/6353da2e153a147b991dd812/4958901_highanglekidcheatingschooltestmin.jpg",
          filename: "sample_media",
        },
        buttons: [
          {
            type: "button",
            sub_type: "url",
            index: 0,
            parameters: [
              {
                type: "text",
                text: otp + "",
              },
            ],
          },
        ],
        carouselCards: [],
        location: {},
        attributes: {},
        paramsFallbackValue: {
          code: otp,
        },
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    res.status(200).json({ message: "OTP sent successfully via phone", otp }); // Remove OTP in production
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send OTP via phone", error });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { rollNo, phone, otp } = req.body;

  if (!rollNo || !phone || !otp) {
    return res
      .status(400)
      .json({ message: "Student ID, phone and OTP are required" });
  }

  // Lookup student
  // First try to find the student using the original roll number
  let student = await Student.findOne({ "Student RollNo": rollNo });

  if (!student) {
    const rollNoInput = rollNo.trim(); // Ensure no extra spaces
    let allStudents = await Student.find({});

    // Convert Mongoose documents to plain objects using map
    allStudents = allStudents.map((s) => s.toObject());

    // Use endsWith to check if the roll number ends with the input
    student = allStudents.find((s) =>
      String(s["Student RollNo"]).endsWith(rollNoInput)
    );

    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }
    // const l = rollNo.length;

    // let allStudents = await Student.find({});

    // allStudents = allStudents.map((s) => s.toObject());

    // student = allStudents.find((s) => {
    //   const currentRollNo = String(s["Student RollNo"])
    //     .split("")
    //     .reverse()
    //     .join("");
    //   return currentRollNo.slice(0, l).split("").reverse().join("") === rollNo;
    // });

    // if (!student) {
    //   return res.status(400).json({ message: "Student not found" });
    // }
  }

  student = Student.hydrate(student);
  // Continue with the rest of your code using the found student

  // Retrieve stored OTP
  const storedOTP = await OTPModel.findOne({ phone });
  if (!storedOTP) {
    return res.status(400).json({ message: "OTP expired or not found" });
  }

  if (storedOTP.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // OTP is valid: delete the OTP entry
  await OTPModel.deleteOne({ phone });

  // Create a session for the exam (lasting 5 hours)
  await Session.create({ student: student._id });

  // res.status(200).json({
  //   message: "OTP verified successfully, exam session started",
  //   session: true,
  // });

  const sessionExpiry = new Date(Date.now() + 5 * 60 * 60 * 1000);

  res.status(200).json({
    message: "OTP verified successfully, exam session started",
    session: true,
    student: student,
    sessionExpiry: sessionExpiry.getTime(), // return as timestamp (milliseconds)
  });
};

export const submitExam = async (req: Request, res: Response) => {
  try {
    // Expect rollNo, courseId and answers object from the request body.
    const { rollNo, courseId, answers } = req.body;

    if (!rollNo || !courseId || !answers) {
      return res.status(400).json({
        message: "rollNo, courseId and answers are required",
      });
    }

    // 1. Lookup the student using roll number.
    let student = await Student.findOne({ "Student RollNo": rollNo });
    if (!student) {
      const rollNoInput = rollNo.trim(); // Ensure no extra spaces
      let allStudents = await Student.find({});

      // Convert Mongoose documents to plain objects using map
      allStudents = allStudents.map((s) => s.toObject());

      // Use endsWith to check if the roll number ends with the input
      student = allStudents.find((s) =>
        String(s["Student RollNo"]).endsWith(rollNoInput)
      );

      if (!student) {
        return res.status(400).json({ message: "Student not found" });
      }
      // const l = rollNo.length;

      // let allStudents = await Student.find({});

      // allStudents = allStudents.map((s) => s.toObject());

      // student = allStudents.find((s) => {
      //   const currentRollNo = String(s["Student RollNo"])
      //     .split("")
      //     .reverse()
      //     .join("");
      //   return currentRollNo.slice(0, l).split("").reverse().join("") === rollNo;
      // });

      // if (!student) {
      //   return res.status(400).json({ message: "Student not found" });
      // }
    }
    const plainStudent = student.toObject();
    const courseIDValue = plainStudent["Course ID"];

    // 2. Validate that the student's course matches the provided courseId.

    if (courseIDValue !== courseId) {
      console.log(courseIDValue, courseId);
      console.log(student, courseIDValue);

      return res
        .status(400)
        .json({ message: "Invalid course for this student" });
    }

    // 3. Retrieve the form/questions for the course.
    // Assuming the FormModel uses a string field "formId" that matches the courseId.
    const form = await QuestionModel.findOne({
      formId: courseId.toString(),
    }).lean();
    if (!form) {
      return res
        .status(404)
        .json({ message: "Form not found for this course" });
    }

    // 4. Calculate marks based on submitted answers.
    // For each question, compare the student's answer with the correct answer.
    // The questions are expected to have a field "correctAnswer" as an array.
    const marks = calculateMarks(form.questions, answers);

    // 5. Update the student's record: save the marks, answers, and mark as attempted.
    student.marks = marks;
    student.answers = answers;
    student.attempted = true;
    await student.save();

    // 6. End the exam session by deleting the session document from MongoDB.
    await Session.deleteOne({ student: student._id });

    return res.status(200).json({
      message: "Exam submitted successfully",
    });
  } catch (error) {
    console.error("Error in submitExam:", error);
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

function calculateMarks(
  questions: any[],
  userAnswers: { [key: string]: number | null }
): number {
  // Convert the user answers object to an array

  const answerarr = Object.values(userAnswers);
  let mark = 0;
  for (let i = 0; i < questions.length; i++) {
    if (questions[i].correctAnswer.includes(answerarr[i])) {
      mark += 1;
    }
  }

  return mark;
}
