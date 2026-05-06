import * as XLSX from 'xlsx';
import { finaleData } from './src/data/finaleData.js';

const ws = XLSX.utils.aoa_to_sheet([]);

const studentsData = finaleData.students;
const questionsData = finaleData.questions.map(q => ({
  id: q.id,
  round: q.round,
  text: q.text,
  options: Array.isArray(q.options) ? q.options.join(' | ') : q.options,
  correctOption: q.correctOption,
  points: q.points
}));
const responsesData = finaleData.responses;

// Place tables side-by-side
XLSX.utils.sheet_add_json(ws, studentsData, { origin: "A1" });
XLSX.utils.sheet_add_json(ws, questionsData, { origin: "F1" });
XLSX.utils.sheet_add_json(ws, responsesData, { origin: "M1" });

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'MasterData');

XLSX.writeFile(wb, './public/sneac_finale_template.xlsx');
console.log("Full mock template generated successfully with side-by-side layout.");
