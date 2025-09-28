

import React, { useState, useCallback, useEffect } from 'react';
import { ref, onValue, push, update, set, remove, get } from 'firebase/database';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { database, googleProvider, auth } from './firebase';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import InquiryList from './components/InquiryList';
import ProgramList from './components/ProgramList';
import PotentialList from './components/PotentialList';
import BatchList from './components/BatchList';
import ResultsList from './components/ResultsList';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';

import { 
  Student, Program, Inquiry, Potential, Employee, View, Batch, ExamResults
} from './types';


// Helper to transform Firebase object into an array
const transformFirebaseData = <T extends { id: string }>(data: any): T[] => {
  if (!data) return [];
  return Object.keys(data).map(key => ({
    id: key,
    ...data[key]
  }));
};


const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authView, setAuthView] = useState<'signIn' | 'signUp'>('signIn');
  
  // --- Firebase-backed State ---
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [potentials, setPotentials] = useState<Potential[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [examResults, setExamResults] = useState<ExamResults>({});
  const [employees, setEmployees] = useState<Employee[]>([]);

  // --- Authorization Check ---
  const checkAuthorization = async (user: User): Promise<boolean> => {
    if (!user.email) {
      console.error("Authorization check failed: User has no email.");
      return false;
    }
    const employeeId = user.email.replace(/[^a-zA-Z0-9]/g, '');
    const employeeRef = ref(database, `employees/${employeeId}`);

    try {
      const employeeSnapshot = await get(employeeRef);

      if (employeeSnapshot.exists()) {
        const employeeData = employeeSnapshot.val();
        if (employeeData.status === 'approved') {
          return true; // Is an employee and is approved
        }
      }
      
      return false; // Not an employee or not approved
    } catch (error) {
      console.error("Authorization check failed:", error);
      return false; // Fail safe
    }
  };

  // --- Auth Effect ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoadingAuth(true); // Show loading during authorization check
        const isAuthorized = await checkAuthorization(user);
        if (isAuthorized) {
          setCurrentUser(user);
        } else {
          alert("You are not authorised to access the platform");
          await signOut(auth); // This will re-trigger onAuthStateChanged with null
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (!currentUser) return; // Don't fetch data if not logged in

    const studentsRef = ref(database, 'users');
    const programsRef = ref(database, 'programs');
    const inquiriesRef = ref(database, 'inquiries');
    const potentialsRef = ref(database, 'potentials');
    const batchesRef = ref(database, 'batches');
    const examsRef = ref(database, 'exams');
    const employeesRef = ref(database, 'employees');

    const unsubscribeStudents = onValue(studentsRef, (snapshot) => {
      setStudents(transformFirebaseData<Student>(snapshot.val()));
    });
    const unsubscribePrograms = onValue(programsRef, (snapshot) => {
      setPrograms(transformFirebaseData<Program>(snapshot.val()));
    });
    const unsubscribeInquiries = onValue(inquiriesRef, (snapshot) => {
      setInquiries(transformFirebaseData<Inquiry>(snapshot.val()));
    });
    const unsubscribePotentials = onValue(potentialsRef, (snapshot) => {
      setPotentials(transformFirebaseData<Potential>(snapshot.val()));
    });
    const unsubscribeBatches = onValue(batchesRef, (snapshot) => {
        setBatches(transformFirebaseData<Batch>(snapshot.val()));
    });
    const unsubscribeExams = onValue(examsRef, (snapshot) => {
        setExamResults(snapshot.val() || {});
    });
    const unsubscribeEmployees = onValue(employeesRef, (snapshot) => {
      setEmployees(transformFirebaseData<Employee>(snapshot.val()));
    });

    // Cleanup listeners on component unmount
    return () => {
      unsubscribeStudents();
      unsubscribePrograms();
      unsubscribeInquiries();
      unsubscribePotentials();
      unsubscribeBatches();
      unsubscribeExams();
      unsubscribeEmployees();
    };
  }, [currentUser]);

  // --- Auth Handlers ---
  const handleSignIn = async (email: string, pass: string) => {
    const employeeId = email.replace(/[^a-zA-Z0-9]/g, '');
    const employeeRef = ref(database, `employees/${employeeId}`);

    try {
      const snapshot = await get(employeeRef);
      if (!snapshot.exists()) {
        // Custom error for non-existent employee
        throw new Error('EMPLOYEE_NOT_FOUND');
      }

      const employeeData = snapshot.val();
      if (employeeData.status !== 'approved') {
        // Custom error for not approved status
        throw new Error('EMPLOYEE_NOT_APPROVED');
      }
      
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      // Don't log our custom, expected errors to the console
      if (error.code) {
        console.error("Sign in failed:", error);
      }
      throw error;
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google sign in failed:", error);
      throw error;
    }
  };
  const handleSignUp = async (email: string, pass: string) => {
    const employeeId = email.replace(/[^a-zA-Z0-9]/g, '');
    const employeeRef = ref(database, `employees/${employeeId}`);

    try {
        const snapshot = await get(employeeRef);
        if (!snapshot.exists()) {
            // Custom error for non-registered employee
            throw new Error('EMPLOYEE_NOT_REGISTERED');
        }
        
        await createUserWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
        // Don't log our custom, expected error to the console
        if (error.code) {
            console.error("Sign up failed:", error);
        }
        throw error;
    }
  };
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setActiveView('dashboard'); // Reset view on sign out
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  // --- CRUD Operations ---

  // Students
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudentRef = push(ref(database, 'users'));
    const newStudent: Omit<Student, 'id'> & { createdAt: string, updatedAt: string } = {
        ...student,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    set(newStudentRef, newStudent);
  };
  const updateStudent = (updatedStudent: Student) => {
    const { id, ...data } = updatedStudent;
    update(ref(database, `users/${id}`), { ...data, updatedAt: new Date().toISOString() });
  };
  const deleteStudent = (studentId: string) => {
    remove(ref(database, `users/${studentId}`));
  };
  const deleteMultipleStudents = (studentIds: string[]) => {
    const updates: { [key: string]: null } = {};
    studentIds.forEach(id => {
      updates[`/users/${id}`] = null;
    });
    update(ref(database), updates);
  };
   const updateMultipleStudentsBatch = (studentIds: string[], newBatchId: string) => {
    const updates: { [key: string]: string | Date } = {};
    const timestamp = new Date().toISOString();
    studentIds.forEach(id => {
      updates[`/users/${id}/batchId`] = newBatchId;
      updates[`/users/${id}/updatedAt`] = timestamp;
    });
    update(ref(database), updates);
  };

  // Inquiries
  const addInquiry = (inquiry: Omit<Inquiry, 'id'>) => {
    push(ref(database, 'inquiries'), inquiry);
  };
  const updateInquiry = (updatedInquiry: Inquiry) => {
    const { id, ...data } = updatedInquiry;
    update(ref(database, `inquiries/${id}`), data);
  };
  const deleteMultipleInquiries = (inquiryIds: string[]) => {
    const updates: { [key: string]: null } = {};
    inquiryIds.forEach(id => {
      updates[`/inquiries/${id}`] = null;
    });
    update(ref(database), updates);
  };

  // Programs
  const addProgram = (program: Omit<Program, 'id'>) => {
     const newProgram = {
      ...program,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    push(ref(database, 'programs'), newProgram);
  };
  const updateProgram = (updatedProgram: Program) => {
    const { id, ...data } = updatedProgram;
    update(ref(database, `programs/${id}`), { ...data, updatedAt: new Date().toISOString() });
  };
  
  // Batches
  const addBatch = (batch: Omit<Batch, 'id'>) => {
    const newBatch = {
      ...batch,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    push(ref(database, 'batches'), newBatch);
  };
  const updateBatch = (updatedBatch: Batch) => {
    const { id, ...data } = updatedBatch;
    update(ref(database, `batches/${id}`), { ...data, updatedAt: new Date().toISOString() });
  };
  
  // Exam Results
  const updateExamResults = (updatedResults: ExamResults) => {
    set(ref(database, 'exams'), updatedResults);
  };

  // Potentials
  const moveToPotentials = (inquiryId: string, remark: string) => {
    const inquiryToMove = inquiries.find(i => i.id === inquiryId);
    if (inquiryToMove) {
      const newPotential: Omit<Potential, 'id'> = { ...inquiryToMove, remark };
      push(ref(database, 'potentials'), newPotential);
      remove(ref(database, `inquiries/${inquiryId}`));
    }
  };
  const moveMultipleToPotentials = (inquiryIds: string[], remark: string) => {
    const updates: { [key: string]: any } = {};
    inquiryIds.forEach(inquiryId => {
      const inquiryToMove = inquiries.find(i => i.id === inquiryId);
      if (inquiryToMove) {
        const { id, ...inquiryData } = inquiryToMove;
        const newPotential: Omit<Potential, 'id'> = { ...inquiryData, remark };
        const newPotentialKey = push(ref(database, 'potentials')).key;
        if (newPotentialKey) {
            updates[`/potentials/${newPotentialKey}`] = newPotential;
            updates[`/inquiries/${inquiryId}`] = null;
        }
      }
    });
    if (Object.keys(updates).length > 0) {
      update(ref(database), updates);
    }
  };
  const updatePotential = (updatedPotential: Potential) => {
    const { id, ...data } = updatedPotential;
    update(ref(database, `potentials/${id}`), data);
  };
  const enrollPotential = (studentData: Omit<Student, 'id'>, potentialId: string) => {
    addStudent(studentData);
    remove(ref(database, `potentials/${potentialId}`));
  };

  const handleSetView = (view: View) => {
      setActiveView(view);
      setIsSidebarOpen(false); // Close sidebar on navigation on mobile
  };

  const renderContent = useCallback(() => {
    if (!currentUser) return null;
    
    switch (activeView) {
      case 'dashboard':
        return <Dashboard students={students} inquiries={inquiries} programs={programs} employees={employees} />;
      case 'students':
        return <StudentList 
                    students={students} 
                    programs={programs} 
                    batches={batches} 
                    onAddStudent={addStudent} 
                    onUpdateStudent={updateStudent} 
                    onDeleteStudent={deleteStudent}
                    onDeleteMultipleStudents={deleteMultipleStudents}
                    onUpdateMultipleStudentsBatch={updateMultipleStudentsBatch}
                />;
      case 'inquiries':
        return <InquiryList 
                    inquiries={inquiries} 
                    programs={programs} 
                    employees={employees} 
                    onAddInquiry={addInquiry} 
                    onUpdateInquiry={updateInquiry} 
                    onMoveToPotentials={moveToPotentials}
                    onMoveMultipleToPotentials={moveMultipleToPotentials}
                    onDeleteMultipleInquiries={deleteMultipleInquiries}
                />;
      case 'programs':
        return <ProgramList programs={programs} onAddProgram={addProgram} onUpdateProgram={updateProgram} />;
      case 'potentials':
        return <PotentialList potentials={potentials} programs={programs} employees={employees} onUpdatePotential={updatePotential} onEnrollPotential={enrollPotential} />;
      case 'batches':
        return <BatchList batches={batches} onAddBatch={addBatch} onUpdateBatch={updateBatch} />;
      case 'results':
        return <ResultsList examResults={examResults} onUpdateExamResults={updateExamResults} />;
      case 'profile':
        return <Profile user={currentUser} onSignOut={handleSignOut} />;
      default:
        return <Dashboard students={students} inquiries={inquiries} programs={programs} employees={employees} />;
    }
  }, [activeView, students, inquiries, programs, potentials, batches, examResults, employees, currentUser]);

  if (loadingAuth) {
    return <div className="flex h-screen w-screen items-center justify-center bg-gray-100 dark:bg-gray-900 text-slate-800 dark:text-slate-200">Loading...</div>;
  }
  
  if (!currentUser) {
    return authView === 'signIn' ? (
      <SignIn
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onSwitchToSignUp={() => setAuthView('signUp')}
      />
    ) : (
      <SignUp onSignUp={handleSignUp} onSwitchToSignIn={() => setAuthView('signIn')} />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-slate-800 dark:bg-gray-900 dark:text-slate-200">
      <Sidebar 
        activeView={activeView} 
        setActiveView={handleSetView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        onSignOut={handleSignOut}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          view={activeView} 
          onMenuClick={() => setIsSidebarOpen(prev => !prev)}
          user={currentUser}
          onSignOut={handleSignOut}
          setActiveView={handleSetView}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 md:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;