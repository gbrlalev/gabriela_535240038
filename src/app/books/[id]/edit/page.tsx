'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    rating: '',
    status: 'want-to-read',
    review: '',
    coverUrl: '',
    isbn: '',
    publishYear: '',
    pages: ''
  });

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
        setFormData({
          title: data.title || '',
          author: data.author || '',
          description: data.description || '',
          rating: data.rating?.toString() || '',
          status: data.status || 'want-to-read',
          review: data.review || '',
          coverUrl: data.coverUrl || '',
          isbn: data.isbn || '',
          publishYear: data.publishYear?.toString() || '',
          pages: data.pages?.toString() || ''
        });
      } else {
        router.push('/404');
      }
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push(`/books/${id}`);
      } else {
        alert('Failed to update book');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Error updating book');
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2">✏️ Edit Book</h1>
            <Link href={`/books/${id}`} className="btn btn-outline-secondary">
              ← Back to Detail
            </Link>
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Author *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="want-to-read">Want to Read</option>
                      <option value="currently-reading">Currently Reading</option>
                      <option value="read">Read</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Rating (1-5)</label>
                    <select
                      className="form-select"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                    >
                      <option value="">No Rating</option>
                      <option value="1">⭐ 1 Star</option>
                      <option value="2">⭐⭐ 2 Stars</option>
                      <option value="3">⭐⭐⭐ 3 Stars</option>
                      <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                      <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Your Review</label>
                  <textarea
                    className="form-control"
                    name="review"
                    value={formData.review}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What did you think about this book?"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Cover Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    name="coverUrl"
                    value={formData.coverUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">ISBN</label>
                    <input
                      type="text"
                      className="form-control"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Publish Year</label>
                    <input
                      type="number"
                      className="form-control"
                      name="publishYear"
                      value={formData.publishYear}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Pages</label>
                    <input
                      type="number"
                      className="form-control"
                      name="pages"
                      value={formData.pages}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}