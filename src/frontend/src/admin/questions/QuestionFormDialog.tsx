import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateQuestion, useUpdateQuestion } from './useQuestionMutations';
import { Difficulty, type Question } from '../../backend';
import { ADMIN_TEXT } from '../components/EnglishText';
import { Loader2 } from 'lucide-react';

interface QuestionFormDialogProps {
  open: boolean;
  onClose: () => void;
  question?: Question | null;
}

interface FormData {
  course: string;
  chapter: string;
  difficulty: Difficulty;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  hint: string;
  explanation: string;
}

export default function QuestionFormDialog({ open, onClose, question }: QuestionFormDialogProps) {
  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>();

  const difficulty = watch('difficulty');

  useEffect(() => {
    if (question) {
      reset({
        course: question.course,
        chapter: question.chapter,
        difficulty: question.difficulty,
        question: question.question,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,
        answer: question.answer,
        hint: question.hint,
        explanation: question.explanation,
      });
    } else {
      reset({
        course: 'MSCIT',
        chapter: '',
        difficulty: Difficulty.medium,
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        answer: '',
        hint: '',
        explanation: '',
      });
    }
  }, [question, reset]);

  const onSubmit = async (data: FormData) => {
    if (question) {
      await updateMutation.mutateAsync({ id: question.id, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
    onClose();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">
            {question ? ADMIN_TEXT.EDIT_QUESTION : ADMIN_TEXT.ADD_QUESTION}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label className="text-gray-300">Chapter</Label>
              <Input
                {...register('chapter', { required: true })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="e.g., Chapter 1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Difficulty</Label>
            <Select
              value={difficulty}
              onValueChange={(value) => setValue('difficulty', value as Difficulty)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Difficulty.easy}>Easy</SelectItem>
                <SelectItem value={Difficulty.medium}>Medium</SelectItem>
                <SelectItem value={Difficulty.hard}>Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Question</Label>
            <Textarea
              {...register('question', { required: true })}
              className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
              placeholder="Enter the question text..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Option A</Label>
              <Input
                {...register('optionA', { required: true })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Option B</Label>
              <Input
                {...register('optionB', { required: true })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Option C</Label>
              <Input
                {...register('optionC', { required: true })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Option D</Label>
              <Input
                {...register('optionD', { required: true })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Correct Answer</Label>
            <Input
              {...register('answer', { required: true })}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="e.g., A, B, C, or D"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Hint</Label>
            <Textarea
              {...register('hint')}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Optional hint for students..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Explanation</Label>
            <Textarea
              {...register('explanation')}
              className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
              placeholder="Explain the correct answer..."
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
