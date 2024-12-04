import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import "./globals.css";
import { QueryProvider } from "./lib/react-query/QueryProvider.tsx";
import {ReactQueryDevtools } from '@tanstack/react-query-devtools'


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthContextProvider>
          <App />

          <ReactQueryDevtools initialIsOpen={false} />

        </AuthContextProvider>
      </QueryProvider>
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>,
);
