import { Difficulty } from '../../../backend';
import type { CSVRow, ValidatedRow } from '../types';

export function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length !== headers.length) continue;

    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    rows.push(row as CSVRow);
  }

  return rows;
}

export function normalizeDifficulty(value: string): Difficulty | null {
  const normalized = value.toLowerCase().trim();
  if (normalized === 'easy') return Difficulty.easy;
  if (normalized === 'medium') return Difficulty.medium;
  if (normalized === 'hard') return Difficulty.hard;
  return null;
}

export function normalizeAnswer(value: string): string {
  return value.toUpperCase().trim();
}
