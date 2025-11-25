'use client';

import { useEffect, useState, use } from 'react'; // Import 'use'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string | null;
  rating: number | null;
  status: string;
  review: string | null;
  coverUrl: string | null;
  isbn: string | null;
  publishYear: number | null;
  pages: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchBook(id);
    }
  }, [id]);

  const fetchBook = async (bookId: string) => {
    try {
      const res = await fetch(`/api/books/${bookId}`);
      if (res.ok) {
        const data = await res.json();
        setBook(data);
      } else {
        router.push('/404');
      }
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await fetch(`/api/books/${id}`, { method: 'DELETE' });
        router.push('/books');
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'want-to-read': 'bg-info',
      'currently-reading': 'bg-warning',
      'read': 'bg-success'
    };
    return badges[status] || 'bg-secondary';
  };

  const getStatusText = (status: string) => {
    const text: any = {
      'want-to-read': 'Want to Read',
      'currently-reading': 'Currently Reading',
      'read': 'Read'
    };
    return text[status] || status;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container py-5 text-center">
        <h2>Book not found</h2>
        <Link href="/books" className="btn btn-primary mt-3">
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link href="/books" className="btn btn-outline-secondary">
          ← Back to Library
        </Link>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            {book.coverUrl ? (
              <img 
                src={book.coverUrl} 
                className="card-img-top" 
                alt={book.title}
                style={{ height: '500px', objectFit: 'cover' }}
              />
            ) : (
              <div 
                className="card-img-top bg-secondary d-flex align-items-center justify-content-center text-white"
                style={{ height: '500px' }}
              >
                <span className="display-1">📚</span>
              </div>
            )}
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link 
                  href={`/books/${book.id}/edit`}
                  className="btn btn-primary"
                >
                  Edit Book
                </Link>
                <button 
                  onClick={handleDelete}
                  className="btn btn-outline-danger"
                >
                  Delete Book
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h1 className="h2 mb-0">{book.title}</h1>
                <span className={`badge ${getStatusBadge(book.status)}`}>
                  {getStatusText(book.status)}
                </span>
              </div>

              <p className="text-muted h5 mb-4">by {book.author}</p>

              {book.rating && (
                <div className="mb-3">
                  <span className="h4">{'⭐'.repeat(book.rating)}</span>
                </div>
              )}

              {book.description && (
                <div className="mb-4">
                  <h5>Description</h5>
                  <p>{book.description}</p>
                </div>
              )}

              {book.review && (
                <div className="mb-4">
                  <h5>My Review</h5>
                  <div className="bg-light p-3 rounded">
                    <p className="mb-0">{book.review}</p>
                  </div>
                </div>
              )}

              <hr />

              <div className="row">
                {book.isbn && (
                  <div className="col-md-6 mb-3">
                    <strong>ISBN:</strong> {book.isbn}
                  </div>
                )}
                {book.publishYear && (
                  <div className="col-md-6 mb-3">
                    <strong>Published:</strong> {book.publishYear}
                  </div>
                )}
                {book.pages && (
                  <div className="col-md-6 mb-3">
                    <strong>Pages:</strong> {book.pages}
                  </div>
                )}
                <div className="col-md-6 mb-3">
                  <strong>Added:</strong> {new Date(book.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}