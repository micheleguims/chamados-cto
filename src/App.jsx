// ==========================================
// APP PRINCIPAL
// SISTEMA DE INFRAESTRUTURA ESCOLAR
// src/App.jsx
// ==========================================

import React, { useState, useEffect } from "react";

import {
  PlusCircle,
  LogOut,
  ClipboardList,
  BarChart3,
  KanbanSquare,
  FileText,
  ShieldCheck
} from "lucide-react";

import LoginView from "./views/LoginView";
import TicketListView from "./views/TicketListView";
import TicketFormView from "./views/TicketFormView";
import TicketDetailsView from "./views/TicketDetailsView";
import AllocationView from "./views/AllocationView";
import MetricsView from "./views/MetricsView";
import DocumentationView from "./views/DocumentationView";

import { createTicket, getTickets } from "./services/ticketService";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const [tickets, setTickets] =
    useState([]);

  const [currentView, setCurrentView] =
    useState("list");

  const [selectedTicket, setSelectedTicket] =
    useState(null);

  const [historyMode, setHistoryMode] =
    useState(false);

  const [filterStatus, setFilterStatus] =
    useState("");

  useEffect(() => {
      const loadTickets = async () => {
        try {
          const data =
            await getTickets();
          setTickets(data || []);
        } catch (error) {
          console.error(
            "Erro ao carregar chamados:",
            error
          );
        }
      };
      loadTickets();
    }, [])


  // ----------------------------------------
  // LOGIN / LOGOUT
  // ----------------------------------------

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentView("list");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("list");
    setSelectedTicket(null);
    setHistoryMode(false);
    setFilterStatus("");
  };

  // ----------------------------------------
  // NAVEGAÇÃO
  // ----------------------------------------

  const navigateTo = (
    view,
    ticket = null
  ) => {
    setSelectedTicket(ticket);
    setCurrentView(view);
  };

  // ----------------------------------------
  // CHAMADOS
  // ----------------------------------------

  const handleAddTicket =
    async (newTicket) => {
      try {
        await createTicket(
          newTicket
        );
        const updatedTickets =
          await getTickets();
        setTickets(
          updatedTickets
        );
        setCurrentView(
          "list"
        );
      } catch (error) {
        console.error(
          "Erro ao salvar chamado:",
          error
        );
        alert(
          "Erro ao salvar chamado."
        );
      }
  };


  const handleUpdateTicket = (
    updatedTicket
  ) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === updatedTicket.id
          ? updatedTicket
          : t
      )
    );

    if (
      selectedTicket &&
      selectedTicket.id === updatedTicket.id
    ) {
      setSelectedTicket(updatedTicket);
    }
  };

  const handleBulkUpdateTickets = (
    updatedArray
  ) => {
    setTickets((prev) => {

      const clone = [...prev];

      updatedArray.forEach((item) => {

        const index =
          clone.findIndex(
            (t) => t.id === item.id
          );

        if (index !== -1) {
          clone[index] = item;
        }
      });

      return clone;
    });
  };

  const handleNavigateWithFilter = (
    status
  ) => {
    setHistoryMode(true);
    setFilterStatus(status);
    setCurrentView("list");
  };

  // ----------------------------------------
  // PERMISSÕES
  // ----------------------------------------

  const role =
    currentUser?.role || "";

  const canViewMetrics =
    [
      "Gestão",
      "COR",
      "CTO",
      "CRE"
    ].includes(role);

  const canViewKanban =
    [
      "Gestão",
      "COR",
      "CTO",
      "CRE"
    ].includes(role);

  // ----------------------------------------
  // LOGIN
  // ----------------------------------------

  if (!currentUser) {
    return (
      <LoginView
        onLogin={handleLogin}
      />
    );
  }

  // ----------------------------------------
  // APP
  // ----------------------------------------

  return (
    <div className="min-h-screen bg-slate-100">

      {/* TOPBAR */}

      <header className="bg-[#13335a] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* LOGO */}
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <ShieldCheck className="w-6 h-6 mr-2" />
                Infraestrutura Escolar
              </h1>

              <p className="text-blue-100 text-sm">
                Monitoramento Operacional da Rede
              </p>
            </div>

            {/* MENU */}
            <nav className="flex flex-wrap gap-4 items-center">

              <button
                onClick={() =>
                  navigateTo("list")
                }
                className={`flex items-center text-sm font-medium transition ${
                  currentView === "list"
                    ? "text-[#66b6e3]"
                    : ""
                }`}
              >
                <ClipboardList className="w-4 h-4 mr-1" />
                Chamados
              </button>

              {canViewKanban && (
                <button
                  onClick={() =>
                    navigateTo("assign")
                  }
                  className={`flex items-center text-sm font-medium transition ${
                    currentView === "assign"
                      ? "text-[#66b6e3]"
                      : ""
                  }`}
                >
                  <KanbanSquare className="w-4 h-4 mr-1" />
                  Operação
                </button>
              )}

              {canViewMetrics && (
                <button
                  onClick={() =>
                    navigateTo("metrics")
                  }
                  className={`flex items-center text-sm font-medium transition ${
                    currentView === "metrics"
                      ? "text-[#66b6e3]"
                      : ""
                  }`}
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Dashboard
                </button>
              )}

              {/* opcional */}
              <button
                onClick={() =>
                  navigateTo("docs")
                }
                className={`flex items-center text-sm font-medium transition ${
                  currentView === "docs"
                    ? "text-[#66b6e3]"
                    : ""
                }`}
              >
                <FileText className="w-4 h-4 mr-1" />
                Documentação
              </button>

            </nav>

            {/* USUÁRIO */}
            <div className="flex items-center gap-3">

              <div className="text-right">
                <div className="font-semibold">
                  {currentUser.username}
                </div>

                <div className="text-xs text-blue-100">
                  {currentUser.role}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>
      </header>

      {/* CONTEÚDO */}

      <main className="max-w-7xl mx-auto px-6 py-6">

        {/* CABEÇALHO DA LISTA */}

        {currentView === "list" && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Chamados de Infraestrutura
              </h2>

              <p className="text-sm text-slate-500">
                Registro, monitoramento e encerramento
                das ocorrências da rede.
              </p>
            </div>

            <button
              onClick={() =>
                navigateTo("new")
              }
              className="bg-[#13335a] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center font-medium transition shadow-sm text-sm"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Chamado
            </button>

          </div>
        )}

        {/* ROTAS */}

        {currentView === "list" && (
          <TicketListView
            tickets={tickets}
            currentUser={currentUser}
            onViewTicket={(ticket) =>
              navigateTo(
                "details",
                ticket
              )
            }
            historyMode={historyMode}
            setHistoryMode={
              setHistoryMode
            }
            filterStatus={
              filterStatus
            }
            setFilterStatus={
              setFilterStatus
            }
          />
        )}

        {currentView === "new" && (
          <TicketFormView
            currentUser={currentUser}
            onSubmit={
              handleAddTicket
            }
            onCancel={() =>
              navigateTo("list")
            }
          />
        )}

        {currentView === "details" &&
          selectedTicket && (
            <TicketDetailsView
              ticket={selectedTicket}
              currentUser={currentUser}
              onBack={() =>
                navigateTo("list")
              }
              onUpdateTicket={
                handleUpdateTicket
              }
            />
          )}

        {currentView === "assign" &&
          canViewKanban && (
            <AllocationView
              tickets={tickets}
              onUpdateTicket={
                handleUpdateTicket
              }
              onBulkUpdateTickets={
                handleBulkUpdateTickets
              }
              onViewTicket={(ticket) =>
                navigateTo(
                  "details",
                  ticket
                )
              }
            />
          )}

        {currentView === "metrics" &&
          canViewMetrics && (
            <MetricsView
              tickets={tickets}
              onNavigateWithFilter={
                handleNavigateWithFilter
              }
            />
          )}

        {currentView === "docs" && (
          <DocumentationView />
        )}

      </main>
    </div>
  );
}