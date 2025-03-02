import { Edit2, Trash2 } from "lucide-react";
import { Category } from "@/hooks/useCategories";

interface CategoryCardProps {
  category: Category;
  onDelete: (category: Category) => void;
  onEdit: (category: Category) => void;
}

export default function CategoryCard({ category, onDelete, onEdit }: CategoryCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {category.name}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(category)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <Edit2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(category)}
              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}