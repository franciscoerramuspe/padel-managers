import { Category } from '@/types/tournament';

export const getCategoryName = (categoryId: string, categories: Category[]) => {
  const category = categories.find(cat => cat.id === categoryId);
  return category?.name || 'Sin categoría';
}; 