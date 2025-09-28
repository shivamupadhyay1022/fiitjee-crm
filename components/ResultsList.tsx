import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import { ExamResults, ExamRecord } from '../types';

// --- Form Input Component ---
const FormInput: React.FC<{
  label: string;
  id: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}> = ({ label, id, ...props }) => (
    <div className="col-span-2 sm:col-span-1">
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
        <input id={id} {...props} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
    </div>
);


// --- Result Edit Form Component ---
const ResultForm: React.FC<{
  initialData: ExamRecord;
  onSubmit: (data: ExamRecord) => void;
  onDelete: () => void;
  onClose: () => void;
}> = ({ initialData, onSubmit, onDelete, onClose }) => {
  const [formData, setFormData] = useState<ExamRecord>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      <FormInput label="Name" id="name" name="name" value={formData.name} onChange={handleChange} required />
      <FormInput label="All India Rank (AIR)" id="air" name="air" value={formData.air} onChange={handleChange} required />
      <FormInput label="Program" id="program" name="program" value={formData.program} onChange={handleChange} required />
      <FormInput label="Score" id="score" name="score" value={formData.score} onChange={handleChange} />
      <div className="col-span-2">
         <FormInput label="Image URL" id="url" name="url" value={formData.url} onChange={handleChange} required />
      </div>
      <div className="col-span-2 flex justify-between items-center pt-4">
          <button 
            type="button" 
            onClick={onDelete} 
            className="px-4 py-2 bg-transparent border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white"
          >
            Delete
          </button>
          <div className="space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-slate-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Update Result</button>
          </div>
      </div>
    </form>
  );
};


// --- Result Card Component ---
const ResultCard: React.FC<{ result: ExamRecord; onEdit: () => void }> = ({ result, onEdit }) => (
    <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-200 relative group">
        <img 
            src={result.url} 
            alt={result.name} 
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-lg"
            onError={(e) => { e.currentTarget.src = 'https://picsum.photos/100'; }} // Fallback image
        />
        <h4 className="font-bold text-slate-800 dark:text-white text-lg">{result.name}</h4>
        <p className="text-red-600 dark:text-red-400 font-semibold">AIR: {result.air}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{result.program}</p>
        {result.score && result.score !== 'NA' && <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Score: {result.score}</p>}
        <button 
            onClick={onEdit}
            className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-300 hover:bg-red-500 hover:text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Edit result for ${result.name}`}
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg>
        </button>
    </div>
);


// --- Main Results List Component ---
interface ResultsListProps {
  examResults: ExamResults;
  onUpdateExamResults: (updatedResults: ExamResults) => void;
}
const ResultsList: React.FC<ResultsListProps> = ({ examResults, onUpdateExamResults }) => {
    const examNames = Object.keys(examResults);
    const [selectedExam, setSelectedExam] = useState<string>(examNames[0] || '');

    const years = useMemo(() => {
        return examResults[selectedExam] ? Object.keys(examResults[selectedExam]).sort((a, b) => parseInt(b) - parseInt(a)) : [];
    }, [examResults, selectedExam]);

    const [selectedYear, setSelectedYear] = useState<string>(years[0] || '');
    const [editingResult, setEditingResult] = useState<{ record: ExamRecord; index: number } | null>(null);

    // Effect to update selected year when exam changes
    React.useEffect(() => {
        const availableYears = examResults[selectedExam] ? Object.keys(examResults[selectedExam]).sort((a, b) => parseInt(b) - parseInt(a)) : [];
        setSelectedYear(availableYears[0] || '');
    }, [selectedExam, examResults]);

    const results = examResults[selectedExam]?.[selectedYear] || [];

    const handleEditSubmit = (updatedRecord: ExamRecord) => {
        if (!editingResult) return;
        
        // Create a deep copy to avoid direct mutation
        const newResultsData = JSON.parse(JSON.stringify(examResults));
        
        // Update the specific record
        newResultsData[selectedExam][selectedYear][editingResult.index] = updatedRecord;

        onUpdateExamResults(newResultsData);
        setEditingResult(null);
    };

    const handleDeleteResult = () => {
        if (!editingResult) return;

        if (window.confirm(`Are you sure you want to delete the result for ${editingResult.record.name}? This action cannot be undone.`)) {
            const newResultsData = JSON.parse(JSON.stringify(examResults));
            
            // Remove the item from the array
            newResultsData[selectedExam][selectedYear].splice(editingResult.index, 1);

            // If the year array is now empty, delete the year key
            if (newResultsData[selectedExam][selectedYear].length === 0) {
                delete newResultsData[selectedExam][selectedYear];
            }

            // If the exam object is now empty (no more years), delete the exam key
            if (Object.keys(newResultsData[selectedExam] || {}).length === 0) {
                delete newResultsData[selectedExam];
            }

            onUpdateExamResults(newResultsData);
            setEditingResult(null);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Exam Results</h3>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex-1">
                    <label htmlFor="exam-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Exam</label>
                    <select
                        id="exam-select"
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                        {examNames.map(exam => <option key={exam} value={exam}>{exam.replace('_', ' ')}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="year-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Year</label>
                    <select
                        id="year-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                        disabled={years.length === 0}
                    >
                        {years.map(year => <option key={year} value={year}>{year.replace('_', ' ')}</option>)}
                    </select>
                </div>
            </div>

            {/* Results Grid */}
            {results.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {results.map((result, index) => (
                        <ResultCard 
                            key={`${result.name}-${index}`} 
                            result={result} 
                            onEdit={() => setEditingResult({ record: result, index })} 
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                    <p>No results found for the selected criteria.</p>
                </div>
            )}

            {/* Edit Modal */}
            <Modal
                isOpen={!!editingResult}
                onClose={() => setEditingResult(null)}
                title={`Edit Result for ${editingResult?.record.name}`}
            >
                {editingResult && (
                    <ResultForm
                        initialData={editingResult.record}
                        onSubmit={handleEditSubmit}
                        onDelete={handleDeleteResult}
                        onClose={() => setEditingResult(null)}
                    />
                )}
            </Modal>

        </div>
    );
};

export default ResultsList;