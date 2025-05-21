import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: String,
  type: String,
  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  metadata: mongoose.Schema.Types.Mixed
});

const Notification = mongoose.models.Notification || 
  mongoose.model("Notification", notificationSchema);

// Add interface for Notification document
interface NotificationDocument {
  _id: mongoose.Types.ObjectId;
  message: string;
  type: string;
  date: Date;
  isRead: boolean;
  metadata?: Record<string, unknown>;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid notification ID" },
        { status: 400 }
      );
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      params.id,
      { isRead: true },
      { new: true }
    ).lean() as NotificationDocument;

    if (!updatedNotification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...updatedNotification,
      id: updatedNotification._id.toString(),
      _id: undefined
    });
  } catch (error) {
    console.error("Failed to update notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
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
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid notification ID" },
        { status: 400 }
      );
    }

    const deletedNotification = await Notification.findByIdAndDelete(
      params.id
    ).lean() as NotificationDocument;

    if (!deletedNotification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      deleted: {
        ...deletedNotification,
        id: deletedNotification._id.toString(),
        _id: undefined
      }
    });
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
