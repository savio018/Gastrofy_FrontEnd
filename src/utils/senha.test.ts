import { describe, expect, it } from 'vitest';
import { requisitosSenha, validarSenha } from './senha';

describe('validarSenha', () => {
  it('aceita uma senha com 8+ caracteres, maiúscula, minúscula e número', () => {
    expect(validarSenha('Abcdef12')).toBe('');
    expect(validarSenha('Senha-Forte-2026')).toBe('');
  });

  it('exige pelo menos 8 caracteres', () => {
    expect(validarSenha('Abcde12')).toBe('A senha deve ter pelo menos 8 caracteres');
  });

  it('exige letra maiúscula', () => {
    expect(validarSenha('abcdefg1')).toBe('A senha deve ter pelo menos uma letra maiúscula');
  });

  it('exige letra minúscula', () => {
    expect(validarSenha('ABCDEFG1')).toBe('A senha deve ter pelo menos uma letra minúscula');
  });

  it('exige número', () => {
    expect(validarSenha('Abcdefgh')).toBe('A senha deve ter pelo menos um número');
  });

  it('devolve a primeira regra que falha, na ordem do cadastro', () => {
    expect(validarSenha('')).toBe('A senha deve ter pelo menos 8 caracteres');
    expect(validarSenha('abc')).toBe('A senha deve ter pelo menos 8 caracteres');
  });
});

describe('requisitosSenha', () => {
  it('marca cada requisito individualmente', () => {
    const itens = requisitosSenha('abcdEFG1');
    expect(itens.map((i) => i.ok)).toEqual([true, true, true, true]);
  });

  it('marca como falhos só os requisitos não atendidos', () => {
    const itens = requisitosSenha('abc');
    expect(itens.map((i) => i.ok)).toEqual([false, false, true, false]);
  });

  it('mantém a mesma lista de textos do cadastro', () => {
    expect(requisitosSenha('').map((i) => i.texto)).toEqual([
      'Mínimo 8 caracteres',
      'Uma letra maiúscula',
      'Uma letra minúscula',
      'Um número',
    ]);
  });
});
