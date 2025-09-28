

import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import { Program, ProgramStatus } from '../types';

// --- Self-Contained Sub-Components ---
const FormInput: React.FC<{
  label: string;
  id: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
        <input id={id} {...props} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
    </div>
);

const FormTextarea: React.FC<{
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}> = ({ label, id, ...props }) => (
    <div className="md:col-span-2">
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
        <textarea id={id} {...props} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"></textarea>
    </div>
);

const FormSelect: React.FC<{
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
}> = ({ label, id, name, value, onChange, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
        <select id={id} name={name} value={value} onChange={onChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
            {children}
        </select>
    </div>
);

const ProgramForm: React.FC<{
    onSubmit: (program: Omit<Program, 'id'> | Program) => void;
    onClose: () => void;
    initialData?: Program;
}> = ({ onSubmit, onClose, initialData }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        category: initialData?.category || 'Engineering',
        code: initialData?.code || '',
        description: initialData?.description || '',
        duration: initialData?.duration || '',
        fee: initialData?.fee || 0,
        status: initialData?.status || ProgramStatus.Active,
        targetAudience: initialData?.targetAudience || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(formData.name && formData.duration && formData.fee > 0) {
            if (initialData) {
                onSubmit({ ...initialData, ...formData });
            } else {
                onSubmit(formData as Omit<Program, 'id'>);
            }
            onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Program Name" id="name" name="name" value={formData.name} onChange={handleChange} required />
                <FormInput label="Program Code" id="code" name="code" value={formData.code} onChange={handleChange} required />
                <FormInput label="Category" id="category" name="category" value={formData.category} onChange={handleChange} required />
                <FormInput label="Duration (e.g., 3 Months)" id="duration" name="duration" value={formData.duration} onChange={handleChange} required />
                <FormInput label="Fee (₹)" id="fee" name="fee" type="number" value={formData.fee} onChange={handleChange} required />
                <FormInput label="Target Audience (e.g., Class 12)" id="targetAudience" name="targetAudience" value={formData.targetAudience} onChange={handleChange} required />
                <FormSelect label="Status" id="status" name="status" value={formData.status} onChange={handleChange}>
                    <option value={ProgramStatus.Active}>Active</option>
                    <option value={ProgramStatus.Inactive}>Inactive</option>
                </FormSelect>
                <FormTextarea label="Description" id="description" name="description" value={formData.description} onChange={handleChange} rows={4} />
            </div>
             <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                    {initialData ? 'Update Program' : 'Add Program'}
                </button>
            </div>
        </form>
    );
};

// --- Main Program List Component ---
interface ProgramListProps {
  programs: Program[];
  onAddProgram: (program: Omit<Program, 'id'>) => void;
  onUpdateProgram: (program: Program) => void;
}
const ProgramList: React.FC<ProgramListProps> = ({ programs, onAddProgram, onUpdateProgram }) => {
    const [modalState, setModalState] = useState<{ mode: 'closed' | 'add' | 'edit'; program?: Program }>({ mode: 'closed' });
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddClick = () => setModalState({ mode: 'add' });
    const handleEditClick = (program: Program) => setModalState({ mode: 'edit', program });
    const handleCloseModal = () => setModalState({ mode: 'closed' });

    const handleFormSubmit = (data: Omit<Program, 'id'> | Program) => {
        if ('id' in data) {
            onUpdateProgram(data);
        } else {
            onAddProgram(data as Omit<Program, 'id'>);
        }
    };
    
    const filteredPrograms = useMemo(() => {
        if (!searchQuery) return programs;
        return programs.filter(program =>
            program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            program.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [programs, searchQuery]);

    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">All Programs</h3>
                <button onClick={handleAddClick} className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Add Program
                </button>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800"
                />
            </div>
            
            <div className="space-y-4">
                {filteredPrograms.length > 0 ? (
                    filteredPrograms.map(program => (
                        <div key={program.id} className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                           <div className="flex-grow">
                                <h4 className="font-bold text-slate-800 dark:text-white">{program.name} ({program.code})</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{program.duration} - For {program.targetAudience}</p>
                           </div>
                           <div className="flex items-center gap-4 flex-shrink-0">
                               <p className="text-lg font-semibold text-red-600 dark:text-red-500">₹{program.fee.toLocaleString('en-IN')}</p>
                               <button onClick={() => handleEditClick(program)} className="font-medium text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">
                                   Edit
                               </button>
                           </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                        <p>No programs found matching "{searchQuery}".</p>
                    </div>
                )}
            </div>

            <Modal 
                isOpen={modalState.mode !== 'closed'} 
                onClose={handleCloseModal} 
                title={modalState.mode === 'add' ? 'Add New Program' : 'Edit Program'}
            >
                <ProgramForm 
                    onSubmit={handleFormSubmit} 
                    onClose={handleCloseModal} 
                    initialData={modalState.program} 
                />
            </Modal>
        </div>
    );
};

export default ProgramList;