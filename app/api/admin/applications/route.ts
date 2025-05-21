import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import { Application } from "@/models/application";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
  await connectToDatabase();

  try {
    const { userId } = await auth();
    
    // Add your admin check logic here
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const applications = await Application.find()
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
