// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import './index.css'
// import App from './report/Report.tsx'
// import { ThemeProvider } from './components/ui/theme-provider.tsx'

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
//       <App />
//     </ThemeProvider>
//   </React.StrictMode>,
// )

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./components/ui/theme-provider.tsx";
import { RouterProvider, createHashRouter } from "react-router-dom";
import Onboard from "./onboard/Onboard.tsx";
import Home from "./home/Home.tsx";
import Report from "./report/Report.tsx";
import AppContext from "./GlobalContext.tsx";
import Profile from "./profile/Profile.tsx";
import Summary from "./report/Summary.tsx";
import Crosscheck from "./report/Crosscheck.tsx";
import NotArticleError from "./home/components/NotArticleError.tsx";
import Login from "./auth/Login.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <Onboard />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/report",
    element: <Report />,
  },
  {
    path: "/summary",
    element: <Summary />,
  },
  {
    path: "/crosscheck",
    element: <Crosscheck />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "not-found",
    element: <NotArticleError url="google.com" />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="w-[385px] h-[595px] flex flex-col px-[15px]">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppContext>
          <RouterProvider router={router} />
        </AppContext>
      </ThemeProvider>
    </div>
  </React.StrictMode>
);
