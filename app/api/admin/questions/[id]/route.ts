import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { JobQuestion } from "@/prisma/mongodb-schema";
import mongoose from 'mongoose';
import { JobPosting } from "@/prisma/mongodb-schema";

export const dynamic = 'force-dynamic';

// Add interface for populated response
interface PopulatedQuestion {
  _id: mongoose.Types.ObjectId;
  jobIds: Array<{ _id: mongoose.Types.ObjectId; title: string }>;
  __v: number;
  // ... other question properties
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const question = await JobQuestion.findById(params.id)
      .populate('jobIds', 'title _id')
      .lean();
    
    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(question);
  } catch (error) {
    console.error("Failed to fetch question:", error);
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    if (!params?.id || !mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Valid Question ID is required" },
        { status: 400 }
      );
    }

    const validJobIds = body.jobIds
      ? body.jobIds
          .filter((id: string) => mongoose.Types.ObjectId.isValid(id))
          .map(id => new mongoose.Types.ObjectId(id))
      : [];

    const updateData = {
      question: body.question,
      type: body.type,
      required: body.required,
      options: body.options || [],
      jobIds: validJobIds,
      updatedAt: new Date()
    };

    const question = await JobQuestion.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { 
        new: true,
        runValidators: true 
      }
    ).populate('jobIds', '_id title');
    
    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }
    
    if (validJobIds.length > 0) {
      await JobPosting.updateMany(
        { _id: { $in: validJobIds } },
        { $addToSet: { questions: new mongoose.Types.ObjectId(params.id) } }
      );
      
      const currentQuestion = await JobQuestion.findById(params.id);
      if (!currentQuestion) {
        return NextResponse.json(
          { error: "Question not found" },
          { status: 404 }
        );
      }

      const previousJobIds = currentQuestion.jobIds?.map(id => id.toString()) || [];
      const removedJobs = previousJobIds.filter(id => 
        !validJobIds.some(vId => vId.toString() === id)
      );
      
      await JobPosting.updateMany(
        { _id: { $in: removedJobs } },
        { $pull: { questions: new mongoose.Types.ObjectId(params.id) } }
      );
    } else {
      await JobPosting.updateMany(
        { questions: new mongoose.Types.ObjectId(params.id) },
        { $pull: { questions: new mongoose.Types.ObjectId(params.id) } }
      );
    }

    // Transform response
    const populatedQuestion = await JobQuestion.findById(params.id)
      .populate('jobIds', 'title')
      .lean() as unknown as PopulatedQuestion;

    const response = {
      ...populatedQuestion,
      id: populatedQuestion._id.toString(),
      jobIds: populatedQuestion.jobIds.map(id => id.toString()),
      jobTitles: populatedQuestion.jobIds.map(job => job.title)
    };

    delete response._id;
    delete response.__v;
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to update question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    await JobQuestion.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Failed to delete question:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
} 