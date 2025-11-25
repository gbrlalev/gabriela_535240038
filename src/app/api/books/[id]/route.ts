import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Props = {
  params: Promise<{ id: string }>
}

// GET - Ambil 1 buku by ID
export async function GET(
  request: NextRequest,
  props: Props
) {
  try {
    const params = await props.params;
    const book = await prisma.book.findUnique({
      where: { id: parseInt(params.id) }
    });
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

// PUT - Update buku
export async function PUT(
  request: NextRequest,
  props: Props
) {
  try {
    const params = await props.params;
    const body = await request.json();
    const book = await prisma.book.update({
      where: { id: parseInt(params.id) },
      data: {
        title: body.title,
        author: body.author,
        description: body.description || null,
        rating: body.rating ? parseInt(body.rating) : null,
        status: body.status,
        review: body.review || null,
        coverUrl: body.coverUrl || null,
        isbn: body.isbn || null,
        publishYear: body.publishYear ? parseInt(body.publishYear) : null,
        pages: body.pages ? parseInt(body.pages) : null,
      }
    });
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus buku
export async function DELETE(
  request: NextRequest,
  props: Props
) {
  try {
    const params = await props.params;
    await prisma.book.delete({
      where: { id: parseInt(params.id) }
    });
    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}