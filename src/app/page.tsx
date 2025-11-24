import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5 text-center">
                <div className="mb-4">
                  <span className="display-1">📚</span>
                </div>
                <h1 className="display-4 fw-bold mb-3">Book Library Manager</h1>
                <p className="lead text-muted mb-4">
                  Track your reading journey, discover new books, and manage your personal library
                </p>
                
                <div className="border-top border-bottom py-4 my-4">
                  <p className="mb-2"><strong>Nama:</strong> Gabriela Levani</p>
                  <p className="mb-2"><strong>NIM:</strong> 535240038</p>
                  <p className="mb-0"><strong>Topik:</strong> Book Library Management System</p>
                </div>

                <div className="d-grid gap-3 d-md-flex justify-content-md-center mt-4">
                  <Link href="/books" className="btn btn-primary btn-lg px-5">
                    My Library
                  </Link>
                  <Link href="/explore" className="btn btn-outline-secondary btn-lg px-5">
                    Explore Books
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}