import { describe, expect, it } from 'vitest';
import {
  arredondar2,
  converterParaBase,
  formatarNumero,
  numeroOuNull,
  paraBase,
  paraCaixas,
  rotuloCaixa,
} from './unidades';

describe('arredondar2', () => {
  it('arredonda para duas casas', () => {
    expect(arredondar2(131.6666)).toBe(131.67);
    expect(arredondar2(2.5)).toBe(2.5);
  });

  it('remove o ruído de ponto flutuante', () => {
    expect(arredondar2(394.99999)).toBe(395);
    expect(arredondar2(0.1 * 3950)).toBe(395);
  });
});

describe('paraBase e paraCaixas', () => {
  it('converte caixas inteiras para a unidade base e de volta', () => {
    expect(paraBase(1, 395)).toBe(395);
    expect(paraBase(5, 395)).toBe(1975);
    expect(paraCaixas(1975, 395)).toBe(5);
  });

  it('converte meia caixa', () => {
    expect(paraBase(0.5, 395)).toBe(197.5);
    expect(paraCaixas(197.5, 395)).toBe(0.5);
  });

  it('arredonda um terço de caixa para duas casas', () => {
    expect(paraBase(1 / 3, 395)).toBe(131.67);
    expect(paraCaixas(1, 3)).toBe(0.33);
  });

  it('nunca devolve valores com mais de duas casas decimais', () => {
    const entradas: Array<[number, number]> = [
      [0.1, 3950],
      [1 / 3, 395],
      [2 / 7, 13],
      [0.7, 0.3],
      [9.99, 394.99999],
    ];
    for (const [caixas, conteudo] of entradas) {
      for (const valor of [paraBase(caixas, conteudo), paraCaixas(caixas, conteudo)]) {
        expect(Math.abs(valor * 100 - Math.round(valor * 100))).toBeLessThan(1e-9);
      }
    }
  });

  it('paraCaixas arredonda para 2 casas quando a divisão não é exata', () => {
    expect(paraCaixas(1000, 395)).toBe(2.53);
  });

  describe('conteúdo por caixa inválido (comportamento atual, sem alterar a função)', () => {
    it('paraBase com conteúdo 0 devolve 0 sem avisar', () => {
      expect(paraBase(2, 0)).toBe(0);
    });

    it('paraBase com conteúdo negativo devolve valor negativo', () => {
      expect(paraBase(2, -395)).toBe(-790);
    });

    it('paraBase com conteúdo NaN devolve NaN', () => {
      expect(paraBase(2, NaN)).toBeNaN();
    });

    it('paraCaixas com conteúdo 0 devolve Infinity para base positiva', () => {
      expect(paraCaixas(790, 0)).toBe(Infinity);
    });

    it('paraCaixas com conteúdo 0 e base 0 devolve NaN', () => {
      expect(paraCaixas(0, 0)).toBeNaN();
    });

    it('paraCaixas com conteúdo negativo devolve valor negativo', () => {
      expect(paraCaixas(790, -395)).toBe(-2);
    });

    it('paraCaixas com conteúdo NaN devolve NaN', () => {
      expect(paraCaixas(790, NaN)).toBeNaN();
    });
  });
});

describe('formatarNumero', () => {
  it('usa vírgula como separador decimal', () => {
    expect(formatarNumero(2.5)).toBe('2,5');
    expect(formatarNumero(131.67)).toBe('131,67');
  });

  it('mostra inteiros sem casas decimais', () => {
    expect(formatarNumero(5)).toBe('5');
    expect(formatarNumero(5.0)).toBe('5');
  });

  it('não agrupa milhares, como nos exemplos da tela', () => {
    expect(formatarNumero(1975)).toBe('1975');
  });

  it('valores não finitos saem como estão (comportamento atual)', () => {
    expect(formatarNumero(Infinity)).toBe('∞');
    expect(formatarNumero(NaN)).toBe('NaN');
  });
});

describe('rotuloCaixa', () => {
  it('usa o texto digitado em unidadeCompra, sem aplicar plural', () => {
    expect(rotuloCaixa('lata')).toBe('lata');
    expect(rotuloCaixa('  cartela  ')).toBe('cartela');
  });

  it('usa "caixa" quando o campo está vazio ou só com espaços', () => {
    expect(rotuloCaixa('')).toBe('caixa');
    expect(rotuloCaixa('   ')).toBe('caixa');
  });
});

describe('numeroOuNull', () => {
  it('devolve null para texto vazio ou não numérico', () => {
    expect(numeroOuNull('')).toBeNull();
    expect(numeroOuNull('   ')).toBeNull();
    expect(numeroOuNull('abc')).toBeNull();
    expect(numeroOuNull('2,5')).toBeNull();
  });

  it('aceita zero, negativos e decimais com ponto', () => {
    expect(numeroOuNull('0')).toBe(0);
    expect(numeroOuNull('-3')).toBe(-3);
    expect(numeroOuNull('1.5')).toBe(1.5);
  });
});

describe('converterParaBase', () => {
  it('converte caixas para a unidade de consumo', () => {
    expect(converterParaBase('2', 'caixa', 395)).toBe(790);
    expect(converterParaBase('0.5', 'caixa', 395)).toBe(197.5);
  });

  it('não converte quando o modo já é unidade de consumo', () => {
    expect(converterParaBase('790', 'consumo', 395)).toBe(790);
    expect(converterParaBase('790', 'consumo', 0)).toBe(790);
  });

  it('devolve null para texto vazio ou inválido', () => {
    expect(converterParaBase('', 'caixa', 395)).toBeNull();
    expect(converterParaBase('abc', 'caixa', 395)).toBeNull();
  });

  it('devolve null em modo caixa quando o conteúdo é 0, negativo ou NaN', () => {
    expect(converterParaBase('2', 'caixa', 0)).toBeNull();
    expect(converterParaBase('2', 'caixa', -395)).toBeNull();
    expect(converterParaBase('2', 'caixa', NaN)).toBeNull();
  });

  it('aceita valores negativos em modo caixa (comportamento atual, sem validação)', () => {
    expect(converterParaBase('-2', 'caixa', 395)).toBe(-790);
  });

  describe('embalagem: só inteiros', () => {
    it('com inteiro=true, arredonda o resultado para inteiro', () => {
      expect(converterParaBase('2.5', 'caixa', 4, true)).toBe(10);
      expect(converterParaBase('2', 'caixa', 50, true)).toBe(100);
    });

    it('sinaliza conversão não exata: o valor sem arredondamento não é inteiro', () => {
      const exato = paraBase(0.3, 5);
      const arredondado = converterParaBase('0.3', 'caixa', 5, true);
      expect(exato).toBe(1.5);
      expect(arredondado).toBe(2);
      expect(Number.isInteger(exato)).toBe(false);
    });

    it('uma conversão exata não é sinalizada', () => {
      expect(Number.isInteger(paraBase(1, 50))).toBe(true);
    });
  });
});
