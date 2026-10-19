import { requisitosSenha } from '../../utils/senha';

interface ChecklistSenhaProps {
  senha: string;
}

export function ChecklistSenha({ senha }: ChecklistSenhaProps) {
  if (!senha) return null;

  return (
    <ul className="mt-2 space-y-1">
      {requisitosSenha(senha).map((req) => (
        <li key={req.texto} className={`text-xs ${req.ok ? 'text-green-600' : 'text-red-500'}`}>
          {req.ok ? '✓' : '✗'} {req.texto}
        </li>
      ))}
    </ul>
  );
}
