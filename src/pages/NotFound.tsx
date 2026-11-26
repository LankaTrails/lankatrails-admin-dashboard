import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="mb-4 text-4xl font-bold">404</h1>
      <p className="mb-4 text-xl text-gray-600">This page does not exist.</p>
      <Link to="/" className="text-primary-600 underline hover:text-primary-700">
        Back to the dashboard
      </Link>
    </div>
  </div>
);

export default NotFound;
