// ==========================================
// TICKET SERVICE
// ==========================================
//
// Responsável por:
//
// CRUD de chamados
//
// - Criar
// - Listar
// - Atualizar
// - Encerrar
// - Reabrir
//
// Integração com Supabase.
//
// ==========================================

import { supabase } from "./supabaseClient";

// =========================
// MAPEADORES
// =========================

function mapRowToTicket(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    priority: row.priority,
    category: row.category,
    subcategory: row.subcategory,
    title: row.title,
    description: row.description,
    impact: row.impact,
    school: {
      name: row.school_name,
      code: row.school_code,
      cre: row.school_cre,
      address: row.school_address,
      neighborhood: row.school_neighborhood,
      phone: row.school_phone
    },
    affectedLocation: row.affected_location,
    scope: row.scope,
    origin: row.origin,
    openedBy: row.opened_by,
    externalAction: row.external_action || {},
    resolution: row.resolution || {},
    recurrence: row.recurrence || {},
    attachments: row.attachments || [],
    comments: row.comments || [],
    history: row.history || []
  };
}

function mapTicketToRow(ticket) {
  return {
    id: ticket.id,
    created_at: ticket.createdAt,
    updated_at: ticket.updatedAt,
    status: ticket.status,
    priority: ticket.priority,
    category: ticket.category,
    subcategory: ticket.subcategory,
    title: ticket.title,
    description: ticket.description,
    impact: ticket.impact,
    school_name: ticket.school?.name || null,
    school_code: ticket.school?.code || null,
    school_cre: ticket.school?.cre || null,
    school_address: ticket.school?.address || null,
    school_neighborhood: ticket.school?.neighborhood || null,
    school_phone: ticket.school?.phone || null,
    affected_location: ticket.affectedLocation,
    scope: ticket.scope,
    origin: ticket.origin,
    opened_by: ticket.openedBy,
    external_action: ticket.externalAction || {},
    resolution: ticket.resolution || {},
    recurrence: ticket.recurrence || {},
    attachments: ticket.attachments || [],
    comments: ticket.comments || [],
    history: ticket.history || []
  };
}

// ==========================================
// LISTAR CHAMADOS
// ==========================================

export async function getTickets() {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(mapRowToTicket);
}

// ==========================================
// BUSCAR CHAMADO POR ID
// ==========================================

export async function getTicketById(id) {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return mapRowToTicket(data);
}

// ==========================================
// CRIAR CHAMADO
// ==========================================

export async function createTicket(ticket) {
  const row = mapTicketToRow(ticket);

  const { data, error } = await supabase
    .from("tickets")
    .insert(row)
    .select()
    .single();

  if (error) throw error;

  return mapRowToTicket(data);
}

// ==========================================
// ATUALIZAR CHAMADO
// ==========================================

export async function updateTicket(ticket) {
  const row = mapTicketToRow(ticket);

  const { data, error } = await supabase
    .from("tickets")
    .update(row)
    .eq("id", ticket.id)
    .select()
    .single();

  if (error) throw error;

  return mapRowToTicket(data);
}

// ==========================================
// EXCLUIR CHAMADO
// ==========================================

export async function deleteTicket(id) {
  const { error } = await supabase
    .from("tickets")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
}