import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Feed from "./Feed";
import Profile from "./Profile";
import Bookmarks from "./Bookmarks"; // Import the new Bookmarks component
import ErrorPage from "./ErrorPage"; // Import the ErrorPage component

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <ErrorPage />, // Add error boundary for the layout
      children: [
        {
          path: "/",
          element: <Feed />,
          errorElement: <ErrorPage />, // Error boundary for feed
        },
        {
          path: "/profile/:id",
          element: <Profile />,
          errorElement: <ErrorPage />, // Error boundary for profile
        },
        {
          path: "/bookmarks",
          element: <Bookmarks />,
          errorElement: <ErrorPage />, // Error boundary for bookmarks
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />, // Error boundary for login
    },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;

