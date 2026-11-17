import React, { lazy } from "react";
import { Navigate, Route } from "react-router-dom";
import { isAuthenticatedAccount } from "../../../utils/accountStorage.js";

const ClientsPage = lazy(() => import("./ClientsPage.jsx"));
const DIRECTORIES = ["Ferrementas - Crie aqui", "Ferramentas - Crie aqui"];
const FILE = "Clientes.html";

export const clientRoutes = DIRECTORIES.map((directory) => (
  <Route
    key={`${directory}/${FILE}`}
    path={`/${directory}/${FILE}`}
    element={isAuthenticatedAccount() ? <ClientsPage /> : <Navigate to="/pages/lembrafarma_auth.html" replace />}
  />
));
