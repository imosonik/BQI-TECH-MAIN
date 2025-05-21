import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import { Application } from "@/models/application";

export async function GET(request: NextRequest) {
  await connectToDatabase();

  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const userEmail = user.emailAddresses[0].emailAddress;

    // Get all applications for the current user
    const applications = await Application.find({ email: userEmail })
      .select('name email phoneNumber position status appliedDate cvUrl answers jobId')
      .lean();

    return NextResponse.json({
      applications: applications.map(app => ({
        ...app,
        id: app._id.toString(),
        _id: undefined
      }))
    });

  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
} 