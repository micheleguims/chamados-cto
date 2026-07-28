// ==========================================
// APP ROUTES
// ==========================================

import {
  BrowserRouter,
  Routes,
  Route
}
from "react-router-dom";
import LoginView from "../views/LoginView";
import TicketListView from "../views/TicketListView";
import TicketFormView from "../views/TicketFormView";
import TicketDetailsView from "../views/TicketDetailsView";
import AllocationView from "../views/AllocationView";
import MetricsView from "../views/MetricsView";
import DocumentationView from "../views/DocumentationView";
import MainLayout from "../layouts/MainLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            <LoginView />
          }
        />
        {/* Área autenticada */}
        <Route
          path="/"
          element={
            <MainLayout />
          }
        >
          <Route
            index
            element={
              <TicketListView />
            }
          />
          <Route
            path="dashboard"
            element={
              <MetricsView />
            }
          />
          <Route
            path="chamados"
            element={
              <TicketListView />
            }
          />
          <Route
            path="chamados/novo"
            element={
              <TicketFormView />
            }
          />
          <Route
            path="chamados/:id"
            element={
              <TicketDetailsView />
            }
          />
          <Route
            path="operacao"
            element={
              <AllocationView />
            }
          />
          <Route
            path="documentacao"
            element={
              <DocumentationView />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}