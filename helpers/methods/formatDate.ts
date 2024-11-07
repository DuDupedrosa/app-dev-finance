import { format } from "date-fns";

export function formatDateHelper(dateToFormat: string, mask: string) {
  if (!dateToFormat) return "-";

  // Cria um objeto Date a partir da string ISO
  const date = new Date(dateToFormat);

  // Formata a data para o formato desejado
  return format(date, mask);
}
