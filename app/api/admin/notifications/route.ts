import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

// Define Notification Schema
const notificationSchema = new mongoose.Schema({
  message: String,
  type: String,
  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  metadata: mongoose.Schema.Types.Mixed
});

const Notification = mongoose.models.Notification || 
  mongoose.model("Notification", notificationSchema);

export async function GET() {
  try {
    await connectToDatabase();
    
    const notifications = await Notification.find()
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(notifications.map(n => ({
      ...n,
      id: n._id.toString(),
      _id: undefined
    })));
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const newNotification = await Notification.create({
      ...body,
      date: new Date()
    });

    return NextResponse.json({
      ...newNotification.toObject(),
      id: newNotification._id.toString(),
      _id: undefined
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
