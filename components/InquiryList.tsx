

import React, { useState, useMemo, useEffect } from 'react';
import Modal from './Modal';
import { Program, Employee, Inquiry, InquiryStatus, InquirySource } from '../types';


// --- Self-Contained Sub-Components ---
const FormInput: React.FC<{ label: string; id: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean; }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
        <input id={id} {...props} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
    </div>
);

const FormTextarea: React.FC<{ label: string; id: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number; }> = ({ label, id, ...props }) => (
    <div className="md:col-span-2">
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
        <textarea id={id} {...props} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"></textarea>
    </div>
);

const FormSelect: React.FC<{ label: string; id: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode; }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
        <select id={id} {...props} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
    </div>
);

const InquiryForm: React.FC<{
    programs: Program[];
    employees: Employee[];
    onSubmit: (inquiry: Omit<Inquiry, 'id'> | Inquiry) => void;
    onClose: () => void;
    initialData?: Inquiry;
}> = ({ programs, employees, onSubmit, onClose, initialData }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        address: initialData?.address || '',
        programOfInterestId: initialData?.programOfInterestId || (programs.length > 0 ? programs[0].id : ''),
        employeeId: initialData?.employeeId || (employees.length > 0 ? employees[0].id : ''),
        status: initialData?.status || InquiryStatus.New,
        source: initialData?.source || InquirySource.Website,
        notes: initialData?.notes || '',
        inquiryDate: initialData?.inquiryDate || new Date().toISOString().split('T')[0],
        followUpDate: initialData?.followUpDate || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData) {
            onSubmit({ ...initialData, ...formData });
        } else {
            onSubmit(formData as Omit<Inquiry, 'id'>);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Full Name" id="name" name="name" value={formData.name} onChange={handleChange} required />
                <FormInput label="Phone Number" id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                <FormInput label="Email Address" id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                <FormInput label="Address" id="address" name="address" value={formData.address} onChange={handleChange} />
                <FormSelect label="Program of Interest" id="programOfInterestId" name="programOfInterestId" value={formData.programOfInterestId} onChange={handleChange}>
                    {programs.map(program => <option key={program.id} value={program.id}>{program.name}</option>)}
                </FormSelect>
                <FormSelect label="Handled By" id="employeeId" name="employeeId" value={formData.employeeId} onChange={handleChange}>
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </FormSelect>
                <FormSelect label="Inquiry Status" id="status" name="status" value={formData.status} onChange={handleChange}>
                    {Object.values(InquiryStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </FormSelect>
                <FormSelect label="Source" id="source" name="source" value={formData.source} onChange={handleChange}>
                    {Object.values(InquirySource).map(s => <option key={s} value={s}>{s}</option>)}
                </FormSelect>
                <FormInput label="Inquiry Date" id="inquiryDate" name="inquiryDate" type="date" value={formData.inquiryDate} onChange={handleChange} required />
                <FormInput label="Follow-up Date" id="followUpDate" name="followUpDate" type="date" value={formData.followUpDate} onChange={handleChange} />
                <FormTextarea label="Notes" id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">{initialData ? 'Update Inquiry' : 'Add Inquiry'}</button>
            </div>
        </form>
    );
};

const MoveToPotentialModal: React.FC<{ onMove: (remark: string) => void; onClose: () => void; isBulk?: boolean }> = ({ onMove, onClose, isBulk = false }) => {
    const [remark, setRemark] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onMove(remark);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormTextarea 
                label={isBulk ? "Remark (will be applied to all selected inquiries)" : "Remark"} 
                id="remark" 
                name="remark" 
                value={remark} 
                onChange={(e) => setRemark(e.target.value)} 
                rows={4} 
            />
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Move to Potentials</button>
            </div>
        </form>
    );
};

const StatusBadge: React.FC<{ status: InquiryStatus }> = ({ status }) => {
    const statusStyles: { [key in InquiryStatus]: string } = {
        [InquiryStatus.New]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        [InquiryStatus.FollowUp]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        [InquiryStatus.Enrolled]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        [InquiryStatus.Dropped]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>{status}</span>;
};


// --- Main Inquiry List Component ---
interface InquiryListProps {
  inquiries: Inquiry[];
  programs: Program[];
  employees: Employee[];
  onAddInquiry: (inquiry: Omit<Inquiry, 'id'>) => void;
  onUpdateInquiry: (inquiry: Inquiry) => void;
  onMoveToPotentials: (inquiryId: string, remark: string) => void;
  onMoveMultipleToPotentials: (inquiryIds: string[], remark: string) => void;
  onDeleteMultipleInquiries: (inquiryIds: string[]) => void;
}
const InquiryList: React.FC<InquiryListProps> = ({ inquiries, programs, employees, onAddInquiry, onUpdateInquiry, onMoveToPotentials, onMoveMultipleToPotentials, onDeleteMultipleInquiries }) => {
    const [modalState, setModalState] = useState<{ mode: 'closed' | 'add' | 'edit' | 'move' | 'bulk-move'; inquiry?: Inquiry }>({ mode: 'closed' });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInquiries, setSelectedInquiries] = useState<string[]>([]);
    
    const programMap = new Map(programs.map(p => [p.id, p.name]));
    const employeeMap = new Map(employees.map(e => [e.id, e.name]));

    const filteredInquiries = useMemo(() => {
        if (!searchQuery) {
            return inquiries;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return inquiries.filter(inquiry =>
            inquiry.name.toLowerCase().includes(lowercasedQuery) ||
            (inquiry.phone && inquiry.phone.includes(searchQuery))
        );
    }, [inquiries, searchQuery]);
    
    useEffect(() => {
        setSelectedInquiries([]);
    }, [searchQuery]);

    const handleSelectInquiry = (inquiryId: string) => {
        setSelectedInquiries(prev => 
            prev.includes(inquiryId)
            ? prev.filter(id => id !== inquiryId)
            : [...prev, inquiryId]
        );
    };

    const handleSelectAll = () => {
        if (selectedInquiries.length === filteredInquiries.length) {
            setSelectedInquiries([]);
        } else {
            setSelectedInquiries(filteredInquiries.map(i => i.id));
        }
    };

    const handleBulkMove = (remark: string) => {
        if (window.confirm(`Are you sure you want to move ${selectedInquiries.length} selected inquiries to potentials?`)) {
            onMoveMultipleToPotentials(selectedInquiries, remark);
            setSelectedInquiries([]);
        }
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedInquiries.length} selected inquiries? This action cannot be undone.`)) {
            onDeleteMultipleInquiries(selectedInquiries);
            setSelectedInquiries([]);
        }
    };
    
    const handleAddClick = () => setModalState({ mode: 'add' });
    const handleEditClick = (inquiry: Inquiry) => setModalState({ mode: 'edit', inquiry });
    const handleMoveClick = (inquiry: Inquiry) => setModalState({ mode: 'move', inquiry });
    const handleCloseModal = () => setModalState({ mode: 'closed' });

    const handleFormSubmit = (data: Omit<Inquiry, 'id'> | Inquiry) => {
        if ('id' in data) {
            onUpdateInquiry(data);
        } else {
            onAddInquiry(data as Omit<Inquiry, 'id'>);
        }
    };
    
    const handleMoveSubmit = (remark: string) => {
        if (modalState.inquiry) {
            onMoveToPotentials(modalState.inquiry.id, remark);
        }
    };

    const renderModalContent = () => {
        if (modalState.mode === 'add' || modalState.mode === 'edit') {
            return <InquiryForm programs={programs} employees={employees} onSubmit={handleFormSubmit} onClose={handleCloseModal} initialData={modalState.inquiry} />;
        }
        if (modalState.mode === 'move') {
            return <MoveToPotentialModal onMove={handleMoveSubmit} onClose={handleCloseModal} />;
        }
        if (modalState.mode === 'bulk-move') {
            return <MoveToPotentialModal onMove={handleBulkMove} onClose={handleCloseModal} isBulk={true} />;
        }
        return null;
    };
    
    const getModalTitle = () => {
        switch (modalState.mode) {
            case 'add': return 'Add New Inquiry';
            case 'edit': return 'Edit Inquiry Record';
            case 'move': return 'Move to Potentials';
            case 'bulk-move': return `Move ${selectedInquiries.length} Inquiries to Potentials`;
            default: return '';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                <div className="flex-1">
                    {selectedInquiries.length > 0 ? (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-2">{selectedInquiries.length} selected</span>
                            <button
                                onClick={() => setModalState({ mode: 'bulk-move' })}
                                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Move Selected
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete Selected
                            </button>
                        </div>
                    ) : (
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">All Inquiries</h3>
                    )}
                </div>
                <button onClick={handleAddClick} className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Add Inquiry
                </button>
            </div>
            
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800"
                />
            </div>

            {filteredInquiries.length > 0 ? (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                                <tr>
                                    <th scope="col" className="p-4">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 dark:border-slate-500 text-red-600 focus:ring-red-500 bg-transparent dark:bg-slate-600"
                                            checked={selectedInquiries.length > 0 && selectedInquiries.length === filteredInquiries.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Program</th>
                                    <th scope="col" className="px-6 py-3">Handled By</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Inquiry Date</th>
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInquiries.map(inquiry => (
                                    <tr key={inquiry.id} className={`border-b dark:border-slate-700 ${selectedInquiries.includes(inquiry.id) ? 'bg-red-50 dark:bg-red-900/20' : 'bg-white dark:bg-slate-800'} hover:bg-slate-50 dark:hover:bg-slate-700`}>
                                        <td className="w-4 p-4">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 dark:border-slate-500 text-red-600 focus:ring-red-500 bg-transparent dark:bg-slate-600"
                                                checked={selectedInquiries.includes(inquiry.id)}
                                                onChange={() => handleSelectInquiry(inquiry.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{inquiry.name}</td>
                                        <td className="px-6 py-4">{programMap.get(inquiry.programOfInterestId) || 'N/A'}</td>
                                        <td className="px-6 py-4">{employeeMap.get(inquiry.employeeId) || 'N/A'}</td>
                                        <td className="px-6 py-4"><StatusBadge status={inquiry.status} /></td>
                                        <td className="px-6 py-4">{new Date(inquiry.inquiryDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-center space-x-2">
                                            <button onClick={() => handleEditClick(inquiry)} className="font-medium text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">Edit</button>
                                            <button onClick={() => handleMoveClick(inquiry)} className="font-medium text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400">Move</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {filteredInquiries.map(inquiry => (
                             <div key={inquiry.id} className={`border rounded-lg p-4 ${selectedInquiries.includes(inquiry.id) ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-700/50 dark:border-slate-700'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 mt-1 bg-transparent dark:bg-slate-600 dark:border-slate-500"
                                            checked={selectedInquiries.includes(inquiry.id)}
                                            onChange={() => handleSelectInquiry(inquiry.id)}
                                        />
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white">{inquiry.name}</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{programMap.get(inquiry.programOfInterestId) || 'N/A'}</p>
                                        </div>
                                    </div>
                                   <StatusBadge status={inquiry.status} />
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600 text-sm space-y-2">
                                    <p><span className="font-medium text-slate-600 dark:text-slate-300">Inquiry Date:</span> {new Date(inquiry.inquiryDate).toLocaleDateString()}</p>
                                    <p><span className="font-medium text-slate-600 dark:text-slate-300">Handled By:</span> {employeeMap.get(inquiry.employeeId) || 'N/A'}</p>
                                    <p><span className="font-medium text-slate-600 dark:text-slate-300">Contact:</span> {inquiry.phone}</p>
                                </div>
                                 <div className="mt-4 flex justify-end gap-4">
                                     <button onClick={() => handleEditClick(inquiry)} className="font-medium text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">Edit</button>
                                     <button onClick={() => handleMoveClick(inquiry)} className="font-medium text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400">Move</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                    <p>No inquiries found matching your criteria.</p>
                </div>
            )}


            <Modal isOpen={modalState.mode !== 'closed'} onClose={handleCloseModal} title={getModalTitle()}>
                {renderModalContent()}
            </Modal>
        </div>
    );
};

export default InquiryList;