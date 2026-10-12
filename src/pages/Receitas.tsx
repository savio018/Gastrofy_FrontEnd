import { ReceitaList } from './ReceitaList';

export function Receitas() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Receitas</h1>
        <p className="mt-1 text-[#6B6B6B]">
          Gerencia suas receitas, ingredientes e custos
        </p>
      </div>

      {/* Conteúdo */}
      <div>
        <ReceitaList />
      </div>
    </div>
  );
}
