export interface RequisitoSenha {
  texto: string;
  ok: boolean;
}

export function requisitosSenha(senha: string): RequisitoSenha[] {
  return [
    { texto: 'Mínimo 8 caracteres', ok: senha.length >= 8 },
    { texto: 'Uma letra maiúscula', ok: /[A-Z]/.test(senha) },
    { texto: 'Uma letra minúscula', ok: /[a-z]/.test(senha) },
    { texto: 'Um número', ok: /[0-9]/.test(senha) },
  ];
}

export function validarSenha(senha: string): string {
  if (senha.length < 8) return 'A senha deve ter pelo menos 8 caracteres';
  if (!/[A-Z]/.test(senha)) return 'A senha deve ter pelo menos uma letra maiúscula';
  if (!/[a-z]/.test(senha)) return 'A senha deve ter pelo menos uma letra minúscula';
  if (!/[0-9]/.test(senha)) return 'A senha deve ter pelo menos um número';
  return '';
}
