import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const jobPostings = await prisma.jobPosting.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        postedDate: 'desc'
      },
      select: {
        title: true,
        department: true,
        location: true,
        description: true,
        postedDate: true,
      }
    });
    return NextResponse.json(jobPostings);
  } catch (error) {
    console.error('Failed to fetch job postings:', error);
    return NextResponse.json({ error: 'Failed to fetch job postings' }, { status: 500 });
  }
}
