import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useDeleteQuestion } from './useQuestionMutations';
import { type Question } from '../../backend';
import { ADMIN_TEXT } from '../components/EnglishText';
import { Loader2 } from 'lucide-react';

interface DeleteQuestionConfirmDialogProps {
  question: Question | null;
  onClose: () => void;
}

export default function DeleteQuestionConfirmDialog({ question, onClose }: DeleteQuestionConfirmDialogProps) {
  const deleteMutation = useDeleteQuestion();

  const handleDelete = async () => {
    if (!question) return;
    await deleteMutation.mutateAsync(question.id);
    onClose();
  };

  return (
    <AlertDialog open={!!question} onOpenChange={onClose}>
      <AlertDialogContent className="bg-gray-900 border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">{ADMIN_TEXT.DELETE_QUESTION}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            {ADMIN_TEXT.DELETE_QUESTION_CONFIRM}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteMutation.isPending}
            className="border-gray-700 hover:bg-gray-800"
          >
            {ADMIN_TEXT.CANCEL}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {ADMIN_TEXT.LOADING}
              </>
            ) : (
              ADMIN_TEXT.DELETE
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
