"use server";

import { z } from "zod";
import type { ActionResponse } from "@/types/action";

import { sendEmail } from "@/lib/email";
import { Dropbox } from "dropbox";
import fetch from "node-fetch";
import { refreshDropboxToken } from "@/utils/dropboxAuth/route"; // Ensure this utility function is correctly imported
import {
  getApplicationConfirmationEmail,
  getBaseEmailTemplate,
} from "@/lib/email-templates";
import mongoose from "mongoose";




const submitApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  cvUrl: z.string().url("Invalid CV URL"),
  answers: z.array(z.object({
    questionId: z.string(),
    questionText: z.string(),
    answer: z.string()
  }))
});

// Rename the local type
type SubmissionResponse = {
  applicationId: string | null;
  error: string | null;
};

export async function submitApplication(data: z.infer<typeof submitApplicationSchema>): Promise<SubmissionResponse> {
  try {
    const parsedData = submitApplicationSchema.parse(data);
    const db = mongoose.connection.db;

    const application = {
      jobId: new mongoose.Types.ObjectId(parsedData.jobId),
      cvUrl: parsedData.cvUrl,
      answers: parsedData.answers.map(answer => ({
        questionId: new mongoose.Types.ObjectId(answer.questionId),
        questionText: answer.questionText,
        answer: answer.answer
      })),
      appliedDate: new Date(),
      status: 'Applied'
    };

    // Direct MongoDB collection access
    const result = await db.collection('applications').insertOne(application);
    
    return {
      applicationId: result.insertedId.toString(),
      error: null,
    };
  } catch (error) {
    console.error("Application submission error:", error);
    return {
      applicationId: null,
      error: error instanceof Error ? error.message : "Failed to submit application",
    };
  }
}
// Function to create a new Dropbox instance
const createDropboxInstance = (accessToken: string) => {
  return new Dropbox({
    accessToken,
    clientId: process.env.DROPBOX_APP_KEY,
    clientSecret: process.env.DROPBOX_APP_SECRET,
    fetch: fetch, // Provide the fetch implementation
  });
};
