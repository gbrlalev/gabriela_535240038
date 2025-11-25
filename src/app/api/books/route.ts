import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Ambil semua buku
export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// POST - Tambah buku baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('Received body:', body);
    
    if (!body.title || !body.author) {
      return NextResponse.json(
        { error: 'Title and author are required' },
        { status: 400 }
      );
    }

    const parseNumber = (value: any): number | null => {
      if (value === null || value === undefined || value === '') {
        return null;
      }
      const parsed = parseInt(value);
      return isNaN(parsed) ? null : parsed;
    };

    const book = await prisma.book.create({
      data: {
        title: body.title,
        author: body.author,
        description: body.description || null,
        rating: parseNumber(body.rating),
        status: body.status || 'want-to-read',
        review: body.review || null,
        coverUrl: body.coverUrl || null,
        isbn: body.isbn || null,
        publishYear: parseNumber(body.publishYear),
        pages: parseNumber(body.pages),
      },
    });

    console.log('Book created:', book);

    return NextResponse.json(book, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/books error:', error);
    console.error('Error details:', error.message);
    
    return NextResponse.json(
      { error: error.message || 'Failed to add book' },
      { status: 500 }
    );
  }
}