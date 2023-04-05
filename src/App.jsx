import { useState } from "react";
import Home from "./pages/Home";
import Repositories from "./pages/Repositories";
import Commit from "./pages/Commit";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/repositories",
          element: <Repositories />,
        },
        {
          path: "/commit",
          element: <Commit />,
        },
      ],
      errorElement: <ErrorPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
