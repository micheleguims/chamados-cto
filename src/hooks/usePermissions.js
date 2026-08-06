// ==========================================
// USE PERMISSIONS
// ==========================================
//
// Hook responsável por:
//
// Regras de acesso:
//
// - Escola
// - CRE
// - COR
// - CTO
// - Admin
//
// Controle:
//
// - Visualização
// - Edição
// - Encerramento
// - Dashboard
// - Operação
//
// Objetivo:
//
// Eliminar verificações:
//
// role === "CRE"
//
// espalhadas pelo sistema.
//
// ==========================================

export function usePermissions(profile) {
  const role = profile?.role;
  const ativo = profile?.ativo === true;

  const isAdmin = ativo && role === "Admin";
  const isCTO = ativo && role === "CTO";
  const isCOR = ativo && role === "COR";
  const isCRE = ativo && role === "CRE";
  const isEscola = ativo && role === "Escola";

  const canManageUsers = isAdmin;
  const canManageRoles = isAdmin;

  const canViewAllTickets = isAdmin || isCTO || isCOR;
  const canViewCRETickets = isCRE;
  const canViewOwnSchoolTickets = isEscola;

  const canCreateTicket = ativo;
  const canEditTicket = isAdmin || isCTO || isCOR || isCRE;
  const canDeleteTicket = isAdmin;

  const canManageSchools = isAdmin || isCTO || isCOR;

  return {
    role,
    ativo,

    isAdmin,
    isCTO,
    isCOR,
    isCRE,
    isEscola,

    canManageUsers,
    canManageRoles,
    canViewAllTickets,
    canViewCRETickets,
    canViewOwnSchoolTickets,
    canCreateTicket,
    canEditTicket,
    canDeleteTicket,
    canManageSchools,
  };
}
