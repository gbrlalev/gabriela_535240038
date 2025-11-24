import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="mb-4">
              <span className="display-1">📚</span>
            </div>
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <h2 className="h3 mb-4">Page Not Found</h2>
            <p className="text-muted mb-4">
              Oops! The page you're looking for seems to have gone missing from our library.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link href="/" className="btn btn-primary btn-lg">
                Go Home
              </Link>
              <Link href="/books" className="btn btn-outline-secondary btn-lg">
                Browse Library
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}