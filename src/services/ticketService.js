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

import { supabase }
  from "./supabaseClient";

//Puxar todos os chamados do banco de dados 'SELECT'
export async function getTickets() {
  const { data, error } =
    await supabase
      .from("tickets")
      .select("*");
 if (error) throw error;
  return data.map(row => ({
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
    affectedLocation:
      row.affected_location,
    scope:
      row.scope,
    origin:
      row.origin,
    openedBy:
      row.opened_by,
    externalAction:
      row.external_action || {},
    resolution:
      row.resolution || {},
    recurrence:
      row.recurrence || {},
    attachments:
      row.attachments || [],
    comments:
      row.comments || [],
    history:
      row.history || []
  }));
}

// Criar um novo chamado no banco de dados 'INSERT'
export async function createTicket(ticket) {
  const row = {
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
    school_name: ticket.school?.name,
    school_code: ticket.school?.code,
    school_cre: ticket.school?.cre,
    school_address: ticket.school?.address,
    school_neighborhood: ticket.school?.neighborhood,
    school_phone: ticket.school?.phone,
    affected_location: ticket.affectedLocation,
    scope: ticket.scope,
    origin: ticket.origin,
    opened_by: ticket.openedBy,
    external_action: ticket.externalAction,
    resolution: ticket.resolution,
    recurrence: ticket.recurrence,
    attachments: ticket.attachments,
    comments: ticket.comments,
    history: ticket.history
  };
  const { data, error } =
    await supabase
      .from("tickets")
      .insert(row)
      .select();
  if (error) throw error;
  return data;
}

// Atualizar um chamado existente no banco de dados 'UPDATE'
export async function updateTicket(
  ticket
) {
    
  const { data, error } =
    await supabase
      .from("tickets")
      .update(ticket)
      .eq("id", ticket.id)
      .select();

  if (error) throw error;

  return data;
}