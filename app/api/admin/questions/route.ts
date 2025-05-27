import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { JobPosting } from '@/models/jobPosting';
import { JobQuestion } from '@/models/jobQuestion';
import mongoose from 'mongoose';
import { z } from 'zod';

interface IQuestionResponse {
  _id: string;
  id: string;
  question: string;
  type: string;
  required: boolean;
  options: string[];
  jobIds: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Add interface for lean document
interface IQuestionDocument {
  _id: mongoose.Types.ObjectId;
  question: string;
  type: string;
  required: boolean;
  options: string[];
  order: number;
  jobId?: mongoose.Types.ObjectId;
}

// Instead of extending, create a new interface
interface IPopulatedQuestion {
  _id: mongoose.Types.ObjectId;
  question: string;
  type: string;
  required: boolean;
  options: string[];
  order: number;
  jobId?: {
    _id: mongoose.Types.ObjectId;
    title: string;
  };
}

// Update the return type for populated question
interface IPopulatedQuestionResponse extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  question: string;
  type: string;
  required: boolean;
  options: string[];
  jobId?: {
    _id: mongoose.Types.ObjectId;
    title: string;
  };
}

const questionSchema = z.object({
  jobId: z.string().refine(val => {
    const trimmed = val.trim();
    return mongoose.isValidObjectId(trimmed);
  }, "Invalid job ID format")
});

export async function GET() {
  try {
    await connectToDatabase();
    
    const questions = await JobQuestion.find()
      .populate({
        path: 'jobIds',
        select: 'title',
        model: 'JobPosting'
      })
      .sort({ order: 1 })
      .lean();

    const transformedQuestions = questions.map(question => ({
      ...question,
      id: question._id.toString(),
      jobTitles: (question.jobIds || []).map(job => job?.title).filter(Boolean),
      jobIds: (question.jobIds || []).map(id => id.toString())
    }));
    
    return NextResponse.json(transformedQuestions);
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const schema = z.object({
      question: z.string().min(1),
      type: z.enum(['text', 'select', 'radio', 'boolean', 'file']),
      required: z.boolean(),
      options: z.array(z.string()).optional(),
      jobIds: z.array(z.string().refine(val => mongoose.isValidObjectId(val))),
      order: z.number().min(0)
    });

    const validation = schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten() },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Convert jobIds to ObjectId
    const jobIds = validation.data.jobIds.map(id => new mongoose.Types.ObjectId(id));

    // Create new question
    const newQuestion = await JobQuestion.create({
      ...validation.data,
      jobIds: jobIds,
      options: validation.data.options || []
    });

    // Update associated jobs
    await JobPosting.updateMany(
      { _id: { $in: jobIds } },
      { $push: { questions: newQuestion._id } }
    );

    return NextResponse.json({
      ...newQuestion.toObject(),
      id: newQuestion._id.toString(),
      jobIds: validation.data.jobIds
    }, { status: 201 });

  } catch (error) {
    console.error("Failed to create question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
} 