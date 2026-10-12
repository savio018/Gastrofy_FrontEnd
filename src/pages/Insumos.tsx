import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InsumosList } from './InsumosList';
import { EmbalagemList } from './EmbalagemList';

type Tab = 'ingredientes' | 'embalagens';

export function Insumos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const abaSelecionada: Tab = searchParams.get('aba') === 'embalagens' ? 'embalagens' : 'ingredientes';

  const selecionarAba = (aba: Tab) => {
    setSearchParams({ aba }, { replace: true });
  };

  const [buscaIngredientes, setBuscaIngredientes] = useState('');
  const [buscaEmbalagens, setBuscaEmbalagens] = useState('');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Insumos</h1>
        <p className="mt-1 text-[#6B6B6B]">
          Gerencia seus ingredientes, embalagens e estoque
        </p>
      </div>

      {/* Abas */}
      <div className="border-b border-[#E5E0DA]">
        <div className="flex gap-8">
          <button
            onClick={() => selecionarAba('ingredientes')}
            className={`pb-3 font-medium transition-colors ${
              abaSelecionada === 'ingredientes'
                ? 'border-b-2 border-[#3D1A1A] text-[#1A1A1A]'
                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            Ingredientes
          </button>
          <button
            onClick={() => selecionarAba('embalagens')}
            className={`pb-3 font-medium transition-colors ${
              abaSelecionada === 'embalagens'
                ? 'border-b-2 border-[#3D1A1A] text-[#1A1A1A]'
                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            Embalagens
          </button>
        </div>
      </div>

      {/* Conteúdo das Abas */}
      <div>
        {abaSelecionada === 'ingredientes' && (
          <InsumosList busca={buscaIngredientes} onBuscaChange={setBuscaIngredientes} />
        )}
        {abaSelecionada === 'embalagens' && (
          <EmbalagemList busca={buscaEmbalagens} onBuscaChange={setBuscaEmbalagens} />
        )}
      </div>
    </div>
  );
}
