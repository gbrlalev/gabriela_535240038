'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/books');

      if (!res.ok) {
        throw new Error('HTTP error! status: ${res.status}');
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Response bukan JSON!");
      }

      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await fetch(`/api/books/${id}`, { method: 'DELETE' });
        fetchBooks(); // Refresh list
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

  const filteredBooks = filter === 'all' 
    ? books 
    : books.filter(book => book.status === filter);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-5 fw-bold">📚 My Library</h1>
        <div>
          <Link href="/" className="btn btn-outline-secondary me-2">
            Home
          </Link>
          <Link href="/explore" className="btn btn-outline-primary me-2">
            Explore Books
          </Link>
          <Link href="/books/add" className="btn btn-primary">
            + Add Book
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({books.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${filter === 'want-to-read' ? 'active' : ''}`}
            onClick={() => setFilter('want-to-read')}
          >
            Want to Read ({books.filter(b => b.status === 'want-to-read').length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${filter === 'currently-reading' ? 'active' : ''}`}
            onClick={() => setFilter('currently-reading')}
          >
            Reading ({books.filter(b => b.status === 'currently-reading').length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read ({books.filter(b => b.status === 'read').length})
          </button>
        </li>
      </ul>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No books found. Start by adding your first book!</p>
          <Link href="/books/add" className="btn btn-primary mt-3">
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="row">
          {filteredBooks.map((book) => (
            <div key={book.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                {book.coverUrl && (
                  <img 
                    src={book.coverUrl} 
                    className="card-img-top" 
                    alt={book.title}
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{book.title}</h5>
                    <span className={`badge ${getStatusBadge(book.status)}`}>
                      {getStatusText(book.status)}
                    </span>
                  </div>
                  <p className="card-text text-muted mb-2">by {book.author}</p>
                  
                  {book.rating && (
                    <div className="mb-2">
                      {'⭐'.repeat(book.rating)}
                    </div>
                  )}
                  
                  {book.description && (
                    <p className="card-text small text-truncate">{book.description}</p>
                  )}
                </div>
                <div className="card-footer bg-transparent">
                  <div className="btn-group w-100">
                    <Link 
                      href={`/books/${book.id}`} 
                      className="btn btn-sm btn-outline-primary"
                    >
                      View
                    </Link>
                    <Link 
                      href={`/books/${book.id}/edit`} 
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(book.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}