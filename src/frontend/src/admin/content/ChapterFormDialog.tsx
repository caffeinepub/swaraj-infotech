import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateChapter, useUpdateChapter } from './useChaptersCategories';
import type { Chapter } from '../../backend';
import { ADMIN_TEXT } from '../components/EnglishText';
import { Loader2 } from 'lucide-react';

interface ChapterFormDialogProps {
  open: boolean;
  onClose: () => void;
  chapter?: Chapter | null;
}

interface FormData {
  course: string;
  name: string;
  order: number;
}

export default function ChapterFormDialog({ open, onClose, chapter }: ChapterFormDialogProps) {
  const createMutation = useCreateChapter();
  const updateMutation = useUpdateChapter();
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>();

  useEffect(() => {
    if (chapter) {
      reset({
        course: chapter.course,
        name: chapter.name,
        order: Number(chapter.order),
      });
    } else {
      reset({
        course: 'MSCIT',
        name: '',
        order: 1,
      });
    }
  }, [chapter, reset]);

  const onSubmit = async (data: FormData) => {
    if (chapter) {
      await updateMutation.mutateAsync({ id: chapter.id, ...data });
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
            {chapter ? ADMIN_TEXT.EDIT_CHAPTER : ADMIN_TEXT.ADD_CHAPTER}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Course</Label>
            <Select
              value={watch('course')}
              onValueChange={(value) => setValue('course', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MSCIT">MSCIT</SelectItem>
                <SelectItem value="GCC-TBC">GCC-TBC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Chapter Name</Label>
            <Input
              {...register('name', { required: true })}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="e.g., Introduction to Computers"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Order</Label>
            <Input
              type="number"
              {...register('order', { required: true, valueAsNumber: true })}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="1"
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
