'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SearchBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    publishedDate?: string;
    pageCount?: number;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<SearchBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingBookId, setAddingBookId] = useState<string | null>(null);

  const searchBooks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`
      );
      const data = await res.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error('Error searching books:', error);
      alert('Failed to search books');
    } finally {
      setLoading(false);
    }
  };

 const handleAddToLibrary = async (book: SearchBook) => {
  setAddingBookId(book.id);
  
  try {
    // Parse publishYear dengan benar
    let publishYear = null;
    if (book.volumeInfo.publishedDate) {
      const year = parseInt(book.volumeInfo.publishedDate.split('-')[0]);
      publishYear = isNaN(year) ? null : year;
    }

    // Parse pageCount dengan benar
    let pages = null;
    if (book.volumeInfo.pageCount) {
      pages = typeof book.volumeInfo.pageCount === 'number' 
        ? book.volumeInfo.pageCount 
        : parseInt(book.volumeInfo.pageCount);
      pages = isNaN(pages) ? null : pages;
    }

    const bookData = {
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors?.join(', ') || 'Unknown Author',
      description: book.volumeInfo.description || null,
      status: 'want-to-read',
      coverUrl: book.volumeInfo.imageLinks?.thumbnail || null,
      isbn: book.volumeInfo.industryIdentifiers?.[0]?.identifier || null,
      publishYear: publishYear,
      pages: pages,
      rating: null,
      review: null
    };

    console.log('Sending book data:', bookData);

    const res = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to add book');
    }

    const result = await res.json();
    console.log('Book added:', result);
    
    alert('✅ Book added to your library!');
  } catch (error: any) {
    console.error('Error adding book:', error);
    alert(`❌ Failed to add book: ${error.message}`);
  } finally {
    setAddingBookId(null);
  }
};

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-5 fw-bold">🔍 Explore Books</h1>
        <Link href="/books" className="btn btn-outline-primary">
          My Library
        </Link>
      </div>

      {/* Search Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={searchBooks} className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search for books by title, author, or ISBN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="btn btn-primary btn-lg px-4"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      {books.length > 0 && (
        <>
          <h2 className="h5 mb-3">Search Results ({books.length})</h2>
          <div className="row">
            {books.map((book) => (
              <div key={book.id} className="col-md-6 col-lg-4 col-xl-3 mb-4">
                <div className="card h-100 shadow-sm">
                  {book.volumeInfo.imageLinks?.thumbnail && (
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      className="card-img-top"
                      alt={book.volumeInfo.title}
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title" style={{ fontSize: '1rem' }}>
                      {book.volumeInfo.title}
                    </h5>
                    <p className="card-text text-muted small mb-2">
                      {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                    </p>
                    {book.volumeInfo.publishedDate && (
                      <p className="card-text small text-muted">
                        Published: {book.volumeInfo.publishedDate.split('-')[0]}
                      </p>
                    )}
                    <button
                      onClick={() => handleAddToLibrary(book)}
                      className="btn btn-primary btn-sm mt-auto"
                      disabled={addingBookId === book.id}
                    >
                      {addingBookId === book.id ? 'Adding...' : '+ Add to Library'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && books.length === 0 && query && (
        <div className="text-center py-5">
          <p className="text-muted">No books found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
}