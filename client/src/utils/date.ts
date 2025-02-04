import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy', { locale: es });
}; 