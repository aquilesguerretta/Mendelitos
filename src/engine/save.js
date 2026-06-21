// ============================================================================
// save.js — Persistência em localStorage. (seção 12)
// Chave única e versionada. Tolerante a ausência de window / JSON inválido.
// ============================================================================

export const SAVE_KEY = 'mendelitos_save_v1'

function temStorage() {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

export function carregar() {
  if (!temStorage()) return null
  try {
    const cru = window.localStorage.getItem(SAVE_KEY)
    if (!cru) return null
    return JSON.parse(cru)
  } catch (e) {
    console.warn('Falha ao carregar save:', e)
    return null
  }
}

export function salvar(estado) {
  if (!temStorage()) return
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(estado))
  } catch (e) {
    console.warn('Falha ao salvar:', e)
  }
}

export function apagar() {
  if (!temStorage()) return
  try {
    window.localStorage.removeItem(SAVE_KEY)
  } catch (e) {
    console.warn('Falha ao apagar save:', e)
  }
}
