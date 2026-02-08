import { useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { parseCSV, normalizeDifficulty, normalizeAnswer } from './csv/csvParsing';
import { validateQuestionRows } from './csv/validateQuestionRows';
import { useBulkUploadQuestions } from './useQuestionMutations';
import type { ValidatedRow } from './types';
import { Difficulty, type Question } from '../../backend';
import { ADMIN_TEXT } from '../components/EnglishText';

export default function BulkUploadQuestionsScreen() {
  const [validatedRows, setValidatedRows] = useState<ValidatedRow[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const uploadMutation = useBulkUploadQuestions();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseCSV(text);
      const validated = validateQuestionRows(rows);
      setValidatedRows(validated);
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const template = `course,chapter,difficulty,question,optionA,optionB,optionC,optionD,answer,hint,explanation
MSCIT,Chapter 1,easy,What is a computer?,Electronic device,Mechanical device,Software,Hardware,A,Think about the basic definition,A computer is an electronic device that processes data.`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    const validRows = validatedRows.filter(vr => vr.isValid);
    if (validRows.length === 0) return;

    const questions: Question[] = validRows.map((vr, index) => ({
      id: BigInt(0), // Will be assigned by backend
      course: vr.row.course.trim(),
      chapter: vr.row.chapter.trim(),
      difficulty: normalizeDifficulty(vr.row.difficulty)!,
      question: vr.row.question.trim(),
      optionA: vr.row.optionA.trim(),
      optionB: vr.row.optionB.trim(),
      optionC: vr.row.optionC.trim(),
      optionD: vr.row.optionD.trim(),
      answer: normalizeAnswer(vr.row.answer),
      hint: vr.row.hint?.trim() || '',
      explanation: vr.row.explanation?.trim() || '',
      createdAt: BigInt(0), // Will be assigned by backend
    }));

    await uploadMutation.mutateAsync(questions);
    setValidatedRows([]);
    setFileName('');
  };

  const validCount = validatedRows.filter(vr => vr.isValid).length;
  const invalidCount = validatedRows.length - validCount;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">{ADMIN_TEXT.BULK_UPLOAD_TITLE}</h2>
        <p className="text-gray-400 mt-1">Upload multiple questions via CSV file</p>
      </div>

      {/* Actions */}
      <div className="glass-card p-6 rounded-xl border border-gray-800">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleDownloadTemplate}
            variant="outline"
            className="border-gray-700 hover:bg-gray-800"
          >
            <Download className="w-4 h-4 mr-2" />
            {ADMIN_TEXT.DOWNLOAD_TEMPLATE}
          </Button>

          <div className="flex-1">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button
                asChild
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 cursor-pointer"
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {ADMIN_TEXT.UPLOAD_CSV}
                </span>
              </Button>
            </label>
          </div>

          {validatedRows.length > 0 && (
            <Button
              onClick={handleImport}
              disabled={validCount === 0 || uploadMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {uploadMutation.isPending ? 'Importing...' : `${ADMIN_TEXT.IMPORT_QUESTIONS} (${validCount})`}
            </Button>
          )}
        </div>

        {fileName && (
          <p className="text-sm text-gray-400 mt-4">
            File: <span className="text-white">{fileName}</span>
          </p>
        )}
      </div>

      {/* Summary */}
      {validatedRows.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <Alert className="bg-green-500/10 border-green-500/30">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <AlertDescription className="text-green-400">
              {validCount} valid rows ready to import
            </AlertDescription>
          </Alert>
          {invalidCount > 0 && (
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <AlertDescription className="text-red-400">
                {invalidCount} rows with errors
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Preview Table */}
      {validatedRows.length > 0 && (
        <div className="glass-card rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white">{ADMIN_TEXT.PREVIEW_ROWS}</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-900/50">
                  <TableHead className="text-gray-400">Row</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Course</TableHead>
                  <TableHead className="text-gray-400">Chapter</TableHead>
                  <TableHead className="text-gray-400">Question</TableHead>
                  <TableHead className="text-gray-400">Errors</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validatedRows.map((vr) => (
                  <TableRow key={vr.rowNumber} className="border-gray-800 hover:bg-gray-900/50">
                    <TableCell className="text-gray-300">{vr.rowNumber}</TableCell>
                    <TableCell>
                      {vr.isValid ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Valid</Badge>
                      ) : (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Invalid</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-300">{vr.row.course}</TableCell>
                    <TableCell className="text-gray-300">{vr.row.chapter}</TableCell>
                    <TableCell className="text-white max-w-md truncate">{vr.row.question}</TableCell>
                    <TableCell>
                      {vr.errors.length > 0 && (
                        <div className="text-xs text-red-400 space-y-1">
                          {vr.errors.map((error, i) => (
                            <div key={i}>• {error}</div>
                          ))}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
