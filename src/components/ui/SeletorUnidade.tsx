interface OpcaoUnidade<T extends string> {
  valor: T;
  texto: string;
}

interface SeletorUnidadeProps<T extends string> {
  opcoes: OpcaoUnidade<T>[];
  valor: T;
  onChange: (valor: T) => void;
  disabled?: boolean;
}

export function SeletorUnidade<T extends string>({
  opcoes,
  valor,
  onChange,
  disabled = false,
}: SeletorUnidadeProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {opcoes.map((opcao) => {
        const selecionado = valor === opcao.valor;
        return (
          <button
            key={opcao.valor}
            type="button"
            onClick={() => onChange(opcao.valor)}
            aria-pressed={selecionado}
            disabled={disabled}
            className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              selecionado
                ? 'border-[#3D1A1A] bg-[#3D1A1A] text-white'
                : 'border-[#E5E0DA] bg-white text-[#1A1A1A] hover:bg-[#F5F0EB]'
            }`}
          >
            {opcao.texto}
          </button>
        );
      })}
    </div>
  );
}
