import { api } from '../lib/api';

export async function reenviarVerificacao(email: string): Promise<void> {
  await api.post('/auth/reenviar-verificacao', { email });
}
