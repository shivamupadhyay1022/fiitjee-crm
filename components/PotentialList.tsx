

import React, { useState } from 'react';
import Modal from './Modal';
import { 
    Potential, Program, Employee, Student,
    InquiryStatus, InquirySource, StudentStatus
} from '../types';

// --- Self-Contained Sub-Components ---
const FormInput: React.FC<{ label: string; id: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; required?: boolean; }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
        <input id={id} {...props} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
    </div>
);

const FormTextarea: React.FC<{ label: string; id: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; rows?: number; }> = ({ label, id, ...props }) => (
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

const EnrollStudentForm: React.FC<{
    programs: Program[];
    onSubmit: (student: Omit<Student, 'id'>) => void;
    onClose: () => void;
    potentialData: Potential;
}> = ({ programs, onSubmit, onClose, potentialData }) => {
    const [formData, setFormData] = useState<Omit<Student, 'id'>>({
        fullName: potentialData.name || '',
        enrollmentId: `ENR${Date.now()}`,
        dob: '',
        className: '',
        school: '',
        programId: potentialData.programOfInterestId || (programs.length > 0 ? programs[0].id : ''),
        batchId: '',
        medium: 'English',
        board: 'CBSE',
        phone: potentialData.phone || '',
        email: potentialData.email || '',
        address: potentialData.address || '',
        status: StudentStatus.Active,
        employeeId: potentialData.employeeId,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
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
                    {programs.map(program => <option key={program.id} value={program.id}>{program.name}</option>)}
                </FormSelect>
            </div>
             <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Enroll Student</button>
            </div>
        </form>
    );
};

const PotentialForm: React.FC<{
    programs: Program[];
    employees: Employee[];
    onSubmit: (potential: Potential) => void;
    onClose: () => void;
    initialData: Potential;
}> = ({ programs, employees, onSubmit, onClose, initialData }) => {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormInput label="Full Name" id="name" name="name" value={formData.name} onChange={handleChange} required />
                <FormInput label="Phone Number" id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                <FormInput label="Email Address" id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
                <FormInput label="Address" id="address" name="address" value={formData.address || ''} onChange={handleChange} />
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
                <FormInput label="Follow-up Date" id="followUpDate" name="followUpDate" type="date" value={formData.followUpDate || ''} onChange={handleChange} />
                <FormTextarea label="Notes" id="notes" name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} />
                <FormTextarea label="Remark" id="remark" name="remark" value={formData.remark} onChange={handleChange} rows={3} />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Update Potential</button>
            </div>
        </form>
    );
};


// --- Main Potential List Component ---
interface PotentialListProps {
  potentials: Potential[];
  programs: Program[];
  employees: Employee[];
  onUpdatePotential: (potential: Potential) => void;
  onEnrollPotential: (studentData: Omit<Student, 'id'>, potentialId: string) => void;
}
const PotentialList: React.FC<PotentialListProps> = ({ potentials, programs, employees, onUpdatePotential, onEnrollPotential }) => {
    const [editingPotential, setEditingPotential] = useState<Potential | null>(null);
    const [enrollingPotential, setEnrollingPotential] = useState<Potential | null>(null);

    const programMap = new Map(programs.map(p => [p.id, p.name]));
    const employeeMap = new Map(employees.map(e => [e.id, e.name]));

    const handleEditClick = (potential: Potential) => setEditingPotential(potential);
    const handleEnrollClick = (potential: Potential) => setEnrollingPotential(potential);
    const handleCloseModal = () => {
        setEditingPotential(null);
        setEnrollingPotential(null);
    };
    
    const handleEnrollSubmit = (studentData: Omit<Student, 'id'>) => {
        if (enrollingPotential) {
            onEnrollPotential(studentData, enrollingPotential.id);
        }
    };


    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Potential Students</h3>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Program</th>
                            <th scope="col" className="px-6 py-3">Handled By</th>
                            <th scope="col" className="px-6 py-3">Remark</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {potentials.map(potential => (
                            <tr key={potential.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{potential.name}</td>
                                <td className="px-6 py-4">{programMap.get(potential.programOfInterestId) || 'N/A'}</td>
                                <td className="px-6 py-4">{employeeMap.get(potential.employeeId) || 'N/A'}</td>
                                <td className="px-6 py-4 truncate max-w-xs">{potential.remark}</td>
                                <td className="px-6 py-4 text-center space-x-4">
                                    <button onClick={() => handleEditClick(potential)} className="font-medium text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">Edit</button>
                                    <button onClick={() => handleEnrollClick(potential)} className="font-medium text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400">Enroll</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {potentials.map(potential => (
                     <div key={potential.id} className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-white">{potential.name}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{programMap.get(potential.programOfInterestId) || 'N/A'}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600 text-sm space-y-2">
                             <p><span className="font-medium text-slate-600 dark:text-slate-300">Handled By:</span> {employeeMap.get(potential.employeeId) || 'N/A'}</p>
                             <p><span className="font-medium text-slate-600 dark:text-slate-300">Remark:</span> {potential.remark}</p>
                        </div>
                         <div className="mt-4 flex justify-end gap-4">
                             <button onClick={() => handleEditClick(potential)} className="font-medium text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">Edit</button>
                             <button onClick={() => handleEnrollClick(potential)} className="font-medium text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400">Enroll</button>
                        </div>
                    </div>
                ))}
            </div>

            {(potentials.length === 0) && (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                    <p>No potential students yet.</p>
                    <p className="text-sm">Move promising leads from the Inquiries page to see them here.</p>
                </div>
            )}

            {editingPotential && (
                <Modal isOpen={!!editingPotential} onClose={handleCloseModal} title="Edit Potential Student">
                    <PotentialForm
                        programs={programs}
                        employees={employees}
                        initialData={editingPotential}
                        onSubmit={onUpdatePotential}
                        onClose={handleCloseModal}
                    />
                </Modal>
            )}

            {enrollingPotential && (
                <Modal isOpen={!!enrollingPotential} onClose={handleCloseModal} title={`Enroll ${enrollingPotential.name}`}>
                   <EnrollStudentForm
                        programs={programs}
                        potentialData={enrollingPotential}
                        onSubmit={handleEnrollSubmit}
                        onClose={handleCloseModal}
                   />
                </Modal>
            )}
        </div>
    );
};

export default PotentialList;