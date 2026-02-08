import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useListCategories, useDeleteCategory } from './useChaptersCategories';
import CategoryFormDialog from './CategoryFormDialog';
import type { Category } from '../../backend';
import { ADMIN_TEXT } from '../components/EnglishText';

export default function CategoriesTab() {
  const { data: categories = [], isLoading } = useListCategories();
  const deleteMutation = useDeleteCategory();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: bigint) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {ADMIN_TEXT.ADD_CATEGORY}
        </Button>
      </div>

      <div className="glass-card rounded-xl border border-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">{ADMIN_TEXT.LOADING}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400">No categories found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-gray-900/50">
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Description</TableHead>
                <TableHead className="text-gray-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id.toString()} className="border-gray-800 hover:bg-gray-900/50">
                  <TableCell className="text-white">{category.name}</TableCell>
                  <TableCell className="text-gray-300">{category.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        className="border-gray-700 hover:bg-gray-800"
                      >
                        {ADMIN_TEXT.EDIT}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        className="border-red-700 text-red-400 hover:bg-red-900/20"
                      >
                        {ADMIN_TEXT.DELETE}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <CategoryFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        category={editingCategory}
      />
    </div>
  );
}
