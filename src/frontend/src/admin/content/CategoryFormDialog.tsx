import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCategory, useUpdateCategory } from './useChaptersCategories';
import type { Category } from '../../backend';
import { ADMIN_TEXT } from '../components/EnglishText';
import { Loader2 } from 'lucide-react';

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
}

interface FormData {
  name: string;
  description: string;
}

export default function CategoryFormDialog({ open, onClose, category }: CategoryFormDialogProps) {
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description,
      });
    } else {
      reset({
        name: '',
        description: '',
      });
    }
  }, [category, reset]);

  const onSubmit = async (data: FormData) => {
    if (category) {
      await updateMutation.mutateAsync({ id: category.id, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
    onClose();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            {category ? ADMIN_TEXT.EDIT_CATEGORY : ADMIN_TEXT.ADD_CATEGORY}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Category Name</Label>
            <Input
              {...register('name', { required: true })}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="e.g., Programming Fundamentals"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Description</Label>
            <Textarea
              {...register('description')}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Brief description of this category..."
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-gray-700 hover:bg-gray-800"
            >
              {ADMIN_TEXT.CANCEL}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {ADMIN_TEXT.LOADING}
                </>
              ) : (
                ADMIN_TEXT.SAVE
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
