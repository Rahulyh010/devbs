import { Request, Response } from "express";
import { QuestionModel } from "../models/question.model";

export const getFormQuestions = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params; // Expect formId to be provided in URL params

    // Fetch the form document using lean() to get a plain JS object
    const form = await QuestionModel.findOne({ formId }).lean();

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Map over the questions array and only include the question text and options
    const safeQuestions = form.questions.map((question: any) => ({
      question: question.question,
      options: question.options,
    }));

    return res.status(200).json({
      formId: form.formId,
      questions: safeQuestions,
    });
  } catch (error) {
    console.error("Error fetching form:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
