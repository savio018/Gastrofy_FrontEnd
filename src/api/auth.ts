import { api } from '../lib/api';

export async function reenviarVerificacao(email: string): Promise<void> {
  await api.post('/auth/reenviar-verificacao', { email });
}

export async function esqueciSenha(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email });
}

export async function confirmarEmail(token: string): Promise<void> {
  await api.get('/auth/verify-email', { params: { token } });
}

export async function redefinirSenha(token: string, novaSenha: string): Promise<void> {
  await api.post('/auth/reset-password', { token, novaSenha });
}
