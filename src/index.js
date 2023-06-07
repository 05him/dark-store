import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { makeServer } from "./server";
import { BrowserRouter } from 'react-router-dom';
import { ProductsProvider, useProducts } from "./context/ProductsContext";
import { ToastProvider, useToastAndLoader } from "./context/ToastAndLoaderContext/ToastAndLoaderContext";
import { AuthProvider, useAuth } from "./context/AuthContext/AuthContext";

export { useProducts, useAuth, useToastAndLoader };

// Call make Server
makeServer();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ProductsProvider>
            <App />
          </ProductsProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
