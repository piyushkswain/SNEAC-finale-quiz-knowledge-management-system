import React, { useRef, useState } from 'react';
import { Upload, Download, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { generateMockData } from '../data/finaleData';
import * as XLSX from 'xlsx';

const DataManager = () => {
  const { data, updateAllData, clearDataAndUseMock } = useData();
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [genStatus, setGenStatus] = useState('');
  const [studentCount, setStudentCount] = useState(20);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const dataBuffer = new Uint8Array(event.target.result);
        const workbook = XLSX.read(dataBuffer, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const ws = workbook.Sheets[sheetName];
        
        // Parse as Array of Arrays
        const aoa = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
        const parsedStudents = [];
        const parsedQuestions = [];
        const parsedResponses = [];

        // Headers are at row 0
        // Students: 0:id, 1:name, 2:school, 3:color
        // Questions: 5:id, 6:round, 7:text, 8:options, 9:correctOption, 10:points
        // Responses: 12:studentId, 13:questionId, 14:chosenOption, 15:timeMs
        
        for (let i = 1; i < aoa.length; i++) {
          const row = aoa[i];
          if (!row) continue;
          
          if (row[0]) {
            parsedStudents.push({
              id: row[0],
              name: row[1],
              school: row[2],
              color: row[3]
            });
          }
          
          if (row[5]) {
            parsedQuestions.push({
              id: row[5],
              round: Number(row[6]),
              text: row[7],
              options: typeof row[8] === 'string' ? row[8].split('|').map(o => o.trim()) : [],
              correctOption: row[9],
              points: Number(row[10])
            });
          }
          
          if (row[12]) {
            parsedResponses.push({
              studentId: row[12],
              questionId: row[13],
              chosenOption: row[14],
              timeMs: Number(row[15])
            });
          }
        }

        // Basic Validation
        if (parsedStudents.length === 0 || parsedQuestions.length === 0) {
          throw new Error("Could not find required tables in the uploaded sheet.");
        }

        const newData = {
          students: parsedStudents,
          questions: parsedQuestions,
          responses: parsedResponses
        };
        
        updateAllData(newData);
        setStatus({ type: 'success', message: 'Excel Data successfully loaded and applied!' });
      } catch (err) {
        setStatus({ type: 'error', message: err.message || 'Failed to parse Excel file.' });
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    
    reader.onerror = () => {
      setStatus({ type: 'error', message: 'Error reading file.' });
    };
    
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = async () => {
    try {
      let count = studentCount;
      if (count > 20) count = 20;
      if (count < 1) count = 1;
      setStudentCount(count);

      // Generate fresh mock data directly for the template
      const templateData = generateMockData(count);

      const ws = XLSX.utils.aoa_to_sheet([]);
      
      const studentsData = templateData.students;
      const questionsData = templateData.questions.map(q => ({
        id: q.id,
        round: q.round,
        text: q.text,
        options: Array.isArray(q.options) ? q.options.join(' | ') : q.options,
        correctOption: q.correctOption,
        points: q.points
      }));
      const responsesData = templateData.responses;

      // Place tables side-by-side
      XLSX.utils.sheet_add_json(ws, studentsData, { origin: "A1" });
      XLSX.utils.sheet_add_json(ws, questionsData, { origin: "F1" });
      XLSX.utils.sheet_add_json(ws, responsesData, { origin: "M1" });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'MasterData');

      // 5. Download the file natively bypassing browser download manager if possible
      if (window.showSaveFilePicker) {
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const handle = await window.showSaveFilePicker({
          suggestedName: 'sneac_finale_template.xlsx',
          types: [{
            description: 'Excel Spreadsheet',
            accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(wbout);
        await writable.close();
        setStatus({ type: 'success', message: 'Template successfully saved to your computer!' });
      } else {
        // Fallback for older browsers
        XLSX.writeFile(wb, 'sneac_finale_template.xlsx');
        setStatus({ type: 'success', message: 'Template successfully downloaded!' });
      }
    } catch (err) {
      // Ignore error if user just cancelled the save dialog
      if (err.name !== 'AbortError') {
        console.error("Download failed:", err);
        setStatus({ type: 'error', message: 'Failed to generate template: ' + err.message });
      }
    }
  };

  const handleReset = () => {
    if(window.confirm("Are you sure you want to reset all data back to the default mock data?")) {
      clearDataAndUseMock();
      setStatus({ type: 'success', message: 'Data reset to mock defaults.' });
    }
  };

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Data Manager</h1>
        <p style={{ color: 'var(--text-muted)' }}>Upload an Excel (.xlsx) file or download a template to populate the system.</p>
      </div>

      {status.message && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          padding: '1rem', 
          marginBottom: '1.5rem', 
          borderRadius: '8px', 
          backgroundColor: status.type === 'error' ? '#fef2f2' : '#ecfdf5',
          color: status.type === 'error' ? '#991b1b' : '#065f46',
          border: `1px solid ${status.type === 'error' ? '#fecaca' : '#a7f3d0'}`
        }}>
          {status.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span style={{ fontWeight: '500' }}>{status.message}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Upload Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Upload size={32} color="var(--primary)" />
          </div>
          <h2 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Upload Excel Data</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            Upload the master Excel (.xlsx) file containing the side-by-side tables to instantly update the live dashboards.
          </p>
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
            id="excel-upload"
          />
          <label 
            htmlFor="excel-upload"
            style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              padding: '0.75rem 2rem', 
              borderRadius: '8px', 
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-block',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            Select Excel File
          </label>
        </div>

        {/* Tools Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Data Tools</h2>
          
          <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Download Template</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>Generate a fresh Excel file with the desired number of students.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Students:</span>
                <input 
                  type="number" 
                  min="1"
                  max="20"
                  value={studentCount} 
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', width: '70px' }}
                />
              </div>
              <button 
                onClick={handleDownloadTemplate}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--primary)', color: 'white', cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                <Download size={20} />
              </button>
            </div>
          </div>

          <div style={{ border: '1px solid #fecaca', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fef2f2' }}>
            <div>
              <h3 style={{ fontSize: '1rem', color: '#991b1b', marginBottom: '0.25rem' }}>Reset to Mock Data</h3>
              <p style={{ color: '#b91c1c', fontSize: '0.75rem', margin: 0 }}>Wipe local storage and revert to test data.</p>
            </div>
            <button 
              onClick={handleReset}
              style={{ padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <RefreshCw size={20} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DataManager;
