
import { useReducer, useState } from "react";
import Home from "./pages/Home";
import Repositories from "./pages/Repositories";
import Commit from "./pages/Commit";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import AppbarLayout from "./pages/layouts/AppbarLayout";
import { StoreContext } from "./store";
import reducer, { initialState } from "./store/reducer";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppbarLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/:user/repositories",
          element: <Repositories />,
        },
        {
          path: "/:user/:repo/commit",
          element: <Commit />,
        },
      ],
      errorElement: <ErrorPage />,
    },
  ]);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      <RouterProvider router={router} />
    </StoreContext.Provider>
  )
}

export default App;
