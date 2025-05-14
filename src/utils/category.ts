import { Category } from '@/types/category';

export const getCategoryName = (categoryId: string, categories: Category[]): string => {
  const category = categories.find(cat => cat.id === categoryId);
  return category?.name || 'Sin categoría'; // Return a default name if not found
}; 