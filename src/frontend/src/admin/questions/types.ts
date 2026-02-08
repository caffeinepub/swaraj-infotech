import { Difficulty, type Question } from '../../backend';

export interface QuestionFormData {
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

export interface QuestionFilters {
  course?: string;
  chapter?: string;
  difficulty?: Difficulty;
  searchTerm?: string;
}

export interface CSVRow {
  course: string;
  chapter: string;
  difficulty: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  hint: string;
  explanation: string;
}

export interface ValidatedRow {
  row: CSVRow;
  rowNumber: number;
  errors: string[];
  isValid: boolean;
}
