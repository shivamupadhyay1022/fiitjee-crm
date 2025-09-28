

import React, { useState } from 'react';
import Modal from './Modal';
import { Batch, BatchStatus } from '../types';

// --- Self-Contained Sub-Components ---
const FormInput: React.FC<{
  label: string;
  id: string;
  name: string;
  value: string;
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
    <div>
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

const BatchForm: React.FC<{
    onSubmit: (batch: Omit<Batch, 'id'> | Batch) => void;
    onClose: () => void;
    initialData?: Batch;
}> = ({ onSubmit, onClose, initialData }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        code: initialData?.code || '',
        remarks: initialData?.remarks || '',
        status: initialData?.status || BatchStatus.Active,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData) {
            onSubmit({ ...initialData, ...formData });
        } else {
            onSubmit(formData as Omit<Batch, 'id'>);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Batch Name" id="name" name="name" value={formData.name} onChange={handleChange} required />
            <FormInput label="Batch Code" id="code" name="code" value={formData.code} onChange={handleChange} required />
            <FormTextarea label="Remarks" id="remarks" name="remarks" value={formData.remarks} onChange={handleChange} rows={4} />
            <FormSelect label="Status" id="status" name="status" value={formData.status} onChange={handleChange}>
                <option value={BatchStatus.Active}>Active</option>
                <option value={BatchStatus.Inactive}>Inactive</option>
            </FormSelect>
             <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                    {initialData ? 'Update Batch' : 'Add Batch'}
                </button>
            </div>
        </form>
    );
};

// --- Main Batch List Component ---
interface BatchListProps {
  batches: Batch[];
  onAddBatch: (batch: Omit<Batch, 'id'>) => void;
  onUpdateBatch: (batch: Batch) => void;
}
const BatchList: React.FC<BatchListProps> = ({ batches, onAddBatch, onUpdateBatch }) => {
    const [modalState, setModalState] = useState<{ mode: 'closed' | 'add' | 'edit'; batch?: Batch }>({ mode: 'closed' });

    const handleAddClick = () => setModalState({ mode: 'add' });
    const handleEditClick = (batch: Batch) => setModalState({ mode: 'edit', batch });
    const handleCloseModal = () => setModalState({ mode: 'closed' });

    const handleFormSubmit = (data: Omit<Batch, 'id'> | Batch) => {
        if ('id' in data) {
            onUpdateBatch(data);
        } else {
            onAddBatch(data as Omit<Batch, 'id'>);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">All Batches</h3>
                <button onClick={handleAddClick} className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Add Batch
                </button>
            </div>
            
            <div className="space-y-4">
                {batches.map(batch => (
                    <div key={batch.id} className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                       <div className="flex-grow">
                            <h4 className="font-bold text-slate-800 dark:text-white">{batch.name} ({batch.code})</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{batch.remarks}</p>
                       </div>
                       <div className="flex items-center gap-4 flex-shrink-0">
                           <span className={`px-2 py-1 text-xs font-medium rounded-full ${batch.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>{batch.status}</span>
                           <button onClick={() => handleEditClick(batch)} className="font-medium text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">
                               Edit
                           </button>
                       </div>
                    </div>
                ))}
            </div>

            <Modal 
                isOpen={modalState.mode !== 'closed'} 
                onClose={handleCloseModal} 
                title={modalState.mode === 'add' ? 'Add New Batch' : 'Edit Batch'}
            >
                <BatchForm
                    onSubmit={handleFormSubmit} 
                    onClose={handleCloseModal} 
                    initialData={modalState.batch} 
                />
            </Modal>
        </div>
    );
};

export default BatchList;