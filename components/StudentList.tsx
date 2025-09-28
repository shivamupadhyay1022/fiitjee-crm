

import React, { useState, useMemo, useEffect } from 'react';
import Modal from './Modal';
import { Student, Program, Batch, StudentStatus } from '../types';

// --- Self-Contained Sub-Components ---
const FormInput: React.FC<{
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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

const StudentForm: React.FC<{
    programs: Program[];
    batches: Batch[];
    onSubmit: (student: Omit<Student, 'id'> | Student) => void;
    onClose: () => void;
    initialData?: Student;
}> = ({ programs, batches, onSubmit, onClose, initialData }) => {
    const [formData, setFormData] = useState({
        fullName: initialData?.fullName || '',
        enrollmentId: initialData?.enrollmentId || '',
        dob: initialData?.dob || '',
        className: initialData?.className || '',
        school: initialData?.school || '',
        programId: initialData?.programId || (programs.length > 0 ? programs[0].id : ''),
        batchId: initialData?.batchId || (batches.length > 0 ? batches[0].id : ''),
        medium: initialData?.medium || 'English',
        board: initialData?.board || 'CBSE',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        address: initialData?.address || '',
        status: initialData?.status || StudentStatus.Active,
        employeeId: initialData?.employeeId || '', // Employee ID is set on enrollment, not editable here
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
            onSubmit({ ...formData, employeeId: 'e_manual' } as Omit<Student, 'id'>);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <h4 className="text-md font-semibold text-slate-500 dark:text-slate-400 md:col-span-2 border-b border-gray-200 dark:border-slate-700 pb-2">Personal Details</h4>
                <FormInput label="Full Name" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                <FormInput label="Enrollment ID" id="enrollmentId" name="enrollmentId" value={formData.enrollmentId} onChange={handleChange} required />
                <FormInput label="Date of Birth" id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
                <FormInput label="Email Address" id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                <FormInput label="Phone Number" id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                <FormTextarea label="Present Address" id="address" name="address" value={formData.address} onChange={handleChange} rows={3} />

                <h4 className="text-md font-semibold text-slate-500 dark:text-slate-400 md:col-span-2 border-b border-gray-200 dark:border-slate-700 pb-2 mt-4">Academic Details</h4>
                <FormInput label="School Name" id="school" name="school" value={formData.school} onChange={handleChange} required />
                <FormInput label="Class" id="className" name="className" value={formData.className} onChange={handleChange} required />
                <FormInput label="Board (e.g., CBSE)" id="board" name="board" value={formData.board} onChange={handleChange} required />
                <FormInput label="Medium" id="medium" name="medium" value={formData.medium} onChange={handleChange} required />
                <FormSelect label="Status" id="status" name="status" value={formData.status} onChange={handleChange}>
                    {Object.values(StudentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </FormSelect>
                

                 <h4 className="text-md font-semibold text-slate-500 dark:text-slate-400 md:col-span-2 border-b border-gray-200 dark:border-slate-700 pb-2 mt-4">Program Information</h4>
                <FormSelect label="Program" id="programId" name="programId" value={formData.programId} onChange={handleChange}>
                    <option value="">Select Program</option>
                    {programs.map(program => <option key={program.id} value={program.id}>{program.name}</option>)}
                </FormSelect>
                 <FormSelect label="Batch" id="batchId" name="batchId" value={formData.batchId} onChange={handleChange}>
                    <option value="">Select Batch</option>
                    {batches.map(batch => <option key={batch.id} value={batch.id}>{batch.name}</option>)}
                </FormSelect>
            </div>
             <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">{initialData ? 'Update Student' : 'Add Student'}</button>
            </div>
        </form>
    );
};

const StatusBadge: React.FC<{ status: StudentStatus }> = ({ status }) => {
    const statusStyles: { [key in StudentStatus]: string } = {
        [StudentStatus.Active]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        [StudentStatus.Inactive]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        [StudentStatus.Completed]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>{status}</span>;
};


// --- Main Student List Component ---
interface StudentListProps {
  students: Student[];
  programs: Program[];
  batches: Batch[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onDeleteMultipleStudents: (studentIds: string[]) => void;
  onUpdateMultipleStudentsBatch: (studentIds: string[], newBatchId: string) => void;
}
const StudentList: React.FC<StudentListProps> = ({ students, programs, batches, onAddStudent, onUpdateStudent, onDeleteStudent, onDeleteMultipleStudents, onUpdateMultipleStudentsBatch }) => {
    const [modalState, setModalState] = useState<{ mode: 'closed' | 'add' | 'edit' | 'bulk-email' | 'bulk-sms' | 'bulk-batch'; student?: Student }>({ mode: 'closed' });
    const [searchByName, setSearchByName] = useState('');
    const [searchByEnrollmentId, setSearchByEnrollmentId] = useState('');
    const [searchByEmail, setSearchByEmail] = useState('');
    const [selectedBatchFilter, setSelectedBatchFilter] = useState('');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    
    // State for bulk action forms
    const [bulkEmailContent, setBulkEmailContent] = useState({ subject: '', message: '' });
    const [bulkSmsContent, setBulkSmsContent] = useState('');
    const [bulkNewBatchId, setBulkNewBatchId] = useState<string>(batches.length > 0 ? batches[0].id : '');

    const programMap = new Map(programs.map(p => [p.id, p.name]));

    const filteredStudents = useMemo(() => {
        let tempStudents = students;
        if (selectedBatchFilter) {
            tempStudents = tempStudents.filter(student => student.batchId === selectedBatchFilter);
        }
        if (searchByName) {
            const lowercasedQuery = searchByName.toLowerCase();
            tempStudents = tempStudents.filter(student =>
                student.fullName.toLowerCase().includes(lowercasedQuery) ||
                (student.phone && student.phone.includes(searchByName))
            );
        }
        if (searchByEnrollmentId) {
            const lowercasedQuery = searchByEnrollmentId.toLowerCase();
            tempStudents = tempStudents.filter(student =>
                student.enrollmentId.toLowerCase().includes(lowercasedQuery)
            );
        }
        if (searchByEmail) {
            const lowercasedQuery = searchByEmail.toLowerCase();
            tempStudents = tempStudents.filter(student =>
                student.email && student.email.toLowerCase().includes(lowercasedQuery)
            );
        }
        return tempStudents;
    }, [students, searchByName, searchByEnrollmentId, searchByEmail, selectedBatchFilter]);

    useEffect(() => {
        setSelectedStudents([]);
    }, [searchByName, searchByEnrollmentId, searchByEmail, selectedBatchFilter]);

    const handleSelectStudent = (studentId: string) => {
        setSelectedStudents(prev => 
            prev.includes(studentId) 
            ? prev.filter(id => id !== studentId)
            : [...prev, studentId]
        );
    };

    const handleSelectAll = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(filteredStudents.map(s => s.id));
        }
    };
    
    const handleAddClick = () => setModalState({ mode: 'add' });
    const handleEditClick = (student: Student) => setModalState({ mode: 'edit', student });
    const handleCloseModal = () => setModalState({ mode: 'closed' });
    
    const handleDeleteClick = (studentId: string, studentName: string) => {
        if (window.confirm(`Are you sure you want to delete the student "${studentName}"? This action cannot be undone.`)) {
            onDeleteStudent(studentId);
        }
    };

    const handleFormSubmit = (data: Omit<Student, 'id'> | Student) => {
        if ('id' in data) {
            onUpdateStudent(data);
        } else {
            onAddStudent(data as Omit<Student, 'id'>);
        }
    };
    
    // --- Bulk Action Handlers ---
    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedStudents.length} selected students? This action cannot be undone.`)) {
            onDeleteMultipleStudents(selectedStudents);
            setSelectedStudents([]);
        }
    };

    const handleBulkEmailSend = () => {
        console.log(`Simulating sending email to ${selectedStudents.length} students.`, bulkEmailContent);
        alert(`Email would be sent to ${selectedStudents.length} students.`);
        setSelectedStudents([]);
        handleCloseModal();
    };
    
    const handleBulkSmsSend = () => {
        console.log(`Simulating sending SMS to ${selectedStudents.length} students.`, bulkSmsContent);
        alert(`SMS would be sent to ${selectedStudents.length} students.`);
        setSelectedStudents([]);
        handleCloseModal();
    };

    const handleBulkBatchChange = () => {
        if (window.confirm(`Are you sure you want to add ${selectedStudents.length} students to the selected batch?`)) {
            onUpdateMultipleStudentsBatch(selectedStudents, bulkNewBatchId);
            setSelectedStudents([]);
            handleCloseModal();
        }
    };

    
     const renderModalContent = () => {
        switch (modalState.mode) {
            case 'add':
            case 'edit':
                return <StudentForm programs={programs} batches={batches} onSubmit={handleFormSubmit} onClose={handleCloseModal} initialData={modalState.student} />;
            case 'bulk-email':
                return (
                    <div className="space-y-4">
                        <FormInput label="Subject" id="subject" name="subject" value={bulkEmailContent.subject} onChange={(e) => setBulkEmailContent(prev => ({ ...prev, subject: e.target.value }))} />
                        <FormTextarea label="Message" id="message" name="message" value={bulkEmailContent.message} onChange={(e) => setBulkEmailContent(prev => ({ ...prev, message: e.target.value }))} rows={6} />
                        <div className="flex justify-end pt-2"><button onClick={handleBulkEmailSend} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Send Email</button></div>
                    </div>
                );
            case 'bulk-sms':
                return (
                     <div className="space-y-4">
                        <FormTextarea label="SMS Message" id="sms" name="sms" value={bulkSmsContent} onChange={(e) => setBulkSmsContent(e.target.value)} rows={5} />
                        <div className="flex justify-end pt-2"><button onClick={handleBulkSmsSend} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Send SMS</button></div>
                    </div>
                );
            case 'bulk-batch':
                 return (
                     <div className="space-y-4">
                        <FormSelect label="Select New Batch" id="newBatch" name="newBatch" value={bulkNewBatchId} onChange={(e) => setBulkNewBatchId(e.target.value)}>
                            {batches.map(batch => <option key={batch.id} value={batch.id}>{batch.name}</option>)}
                        </FormSelect>
                        <div className="flex justify-end pt-2"><button onClick={handleBulkBatchChange} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Add to Batch</button></div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    const getModalTitle = () => {
        switch (modalState.mode) {
            case 'add': return 'Add New Student';
            case 'edit': return 'Edit Student Record';
            case 'bulk-email': return `Send Email to ${selectedStudents.length} Students`;
            case 'bulk-sms': return `Send SMS to ${selectedStudents.length} Students`;
            case 'bulk-batch': return `Add ${selectedStudents.length} Students to Batch`;
            default: return '';
        }
    }


    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                 <div className="flex-1">
                    {selectedStudents.length > 0 ? (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-2">{selectedStudents.length} selected</span>
                            <button onClick={() => setModalState({ mode: 'bulk-email' })} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Send Email</button>
                            <button onClick={() => setModalState({ mode: 'bulk-sms' })} className="px-3 py-1.5 text-sm bg-sky-600 text-white rounded-md hover:bg-sky-700">Send SMS</button>
                            <button onClick={() => setModalState({ mode: 'bulk-batch' })} className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700">Add to Batch</button>
                            <button onClick={handleBulkDelete} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">Delete Selected</button>
                        </div>
                    ) : (
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">All Students</h3>
                    )}
                </div>
                <button onClick={handleAddClick} className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Add Student
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <input
                    type="text"
                    placeholder="Search by name/phone..."
                    value={searchByName}
                    onChange={(e) => setSearchByName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800"
                />
                <input
                    type="text"
                    placeholder="Search by Enrollment ID..."
                    value={searchByEnrollmentId}
                    onChange={(e) => setSearchByEnrollmentId(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800"
                />
                <input
                    type="email"
                    placeholder="Search by email..."
                    value={searchByEmail}
                    onChange={(e) => setSearchByEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800"
                />
                <select
                    value={selectedBatchFilter}
                    onChange={(e) => setSelectedBatchFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800"
                >
                    <option value="">All Batches</option>
                    {batches.map(batch => (
                        <option key={batch.id} value={batch.id}>{batch.name}</option>
                    ))}
                </select>
            </div>

            {filteredStudents.length > 0 ? (
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
                                            checked={selectedStudents.length > 0 && selectedStudents.length === filteredStudents.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Enrollment ID</th>
                                    <th scope="col" className="px-6 py-3">Program</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Phone No.</th>
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(student => (
                                    <tr key={student.id} className={`border-b dark:border-slate-700 ${selectedStudents.includes(student.id) ? 'bg-red-50 dark:bg-red-900/20' : 'bg-white dark:bg-slate-800'} hover:bg-slate-50 dark:hover:bg-slate-700`}>
                                        <td className="w-4 p-4">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 dark:border-slate-500 text-red-600 focus:ring-red-500 bg-transparent dark:bg-slate-600"
                                                checked={selectedStudents.includes(student.id)}
                                                onChange={() => handleSelectStudent(student.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{student.fullName}</td>
                                        <td className="px-6 py-4">{student.enrollmentId}</td>
                                        <td className="px-6 py-4">{programMap.get(student.programId) || 'N/A'}</td>
                                        <td className="px-6 py-4"><StatusBadge status={student.status} /></td>
                                        <td className="px-6 py-4">{student.phone}</td>
                                        <td className="px-6 py-4 text-center space-x-4">
                                            <button 
                                                onClick={() => handleEditClick(student)}
                                                className="font-medium text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(student.id, student.fullName)}
                                                className="font-medium text-gray-500 hover:text-red-700 dark:text-gray-400 dark:hover:text-red-500"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {filteredStudents.map(student => (
                            <div key={student.id} className={`border rounded-lg p-4 ${selectedStudents.includes(student.id) ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-700/50 dark:border-slate-700'}`}>
                                <div className="flex justify-between items-start">
                                     <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 dark:border-slate-500 text-red-600 focus:ring-red-500 mt-1 bg-transparent dark:bg-slate-600"
                                            checked={selectedStudents.includes(student.id)}
                                            onChange={() => handleSelectStudent(student.id)}
                                        />
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white">{student.fullName}</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{student.enrollmentId}</p>
                                        </div>
                                    </div>
                                   <StatusBadge status={student.status} />
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600 text-sm space-y-2 text-slate-600 dark:text-slate-400">
                                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Program:</span> {programMap.get(student.programId) || 'N/A'}</p>
                                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Contact:</span> {student.phone}</p>
                                </div>
                                 <div className="mt-4 flex justify-end gap-4">
                                    <button onClick={() => handleEditClick(student)} className="font-medium text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">Edit</button>
                                    <button onClick={() => handleDeleteClick(student.id, student.fullName)} className="font-medium text-gray-500 hover:text-red-700 dark:text-gray-400 dark:hover:text-red-500">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                    <p>No students found matching your criteria.</p>
                </div>
            )}


            <Modal isOpen={modalState.mode !== 'closed'} onClose={handleCloseModal} title={getModalTitle()}>
                {renderModalContent()}
            </Modal>
        </div>
    );
};

export default StudentList;