import { api } from '../lib/api';
import type { Alerta } from '../types';

export async function listarAlertas(): Promise<Alerta[]> {
  const response = await api.get<Alerta[]>('/alertas');
  return response.data;
}
