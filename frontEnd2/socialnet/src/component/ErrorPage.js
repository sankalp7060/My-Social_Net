import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-4xl font-bold text-[#048193] mb-4">Oops!</h1>
        <p className="text-lg mb-4">Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-500 mb-6">
          {error.statusText || error.message}
        </p>
        <Link
          to="/"
          className="px-6 py-2 bg-[#048193] text-white rounded-full hover:bg-[#3A9DA8] transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;