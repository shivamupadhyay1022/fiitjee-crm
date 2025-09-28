
import React, { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Student, Inquiry, Program, Employee, InquiryStatus } from '../types';
import { useTheme } from './ThemeContext';

// --- Self-Contained Sub-Components ---
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
    </div>
  </div>
);


interface DashboardProps {
  students: Student[];
  inquiries: Inquiry[];
  programs: Program[];
  employees: Employee[];
}

const Dashboard: React.FC<DashboardProps> = ({ students, inquiries, programs, employees }) => {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b'; // slate-400 or slate-500
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(128, 128, 128, 0.2)';
  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(5px)',
    border: `1px solid ${theme === 'dark' ? '#475569' : '#ccc'}`,
    color: theme === 'dark' ? '#f1f5f9' : '#333'
  };


  const totalStudents = students.length;
  const activeInquiries = inquiries.filter(i => i.status === InquiryStatus.New || i.status === InquiryStatus.FollowUp).length;
  const totalPrograms = programs.length;

  const programStudentData = programs.map(program => ({
    name: program.name,
    students: students.filter(student => student.programId === program.id).length,
  }));
  
  const employeeConversionCounts = useMemo(() => {
    const conversionCounts = new Map<string, number>();
    students.forEach(student => {
        if (student.employeeId) {
            conversionCounts.set(student.employeeId, (conversionCounts.get(student.employeeId) || 0) + 1);
        }
    });

    return employees
      .map(employee => ({
        employeeId: employee.id,
        name: employee.name,
        conversions: conversionCounts.get(employee.id) || 0,
      }))
      .sort((a, b) => b.conversions - a.conversions);
  }, [students, employees]);

  const weeklyConversionData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d;
    }).reverse();

    return last7Days.map(date => {
        const dateString = date.toISOString().split('T')[0];
        const count = students.filter(s => s.createdAt && s.createdAt.startsWith(dateString)).length;
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            enrolled: count,
        };
    });
  }, [students]);


  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={totalStudents} 
          color="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.273-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.273.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
        />
        <StatCard 
          title="Active Inquiries" 
          value={activeInquiries} 
          color="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
        />
        <StatCard 
          title="Total Programs" 
          value={totalPrograms} 
          color="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9 5.747h18"></path><path d="M12 6.253v11.494m-9 5.747h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 6.253L3 9.75l6.75 3.497M14.25 6.253L21 9.75l-6.75 3.497"></path></svg>}
        />
        <StatCard 
          title="Revenue (Monthly)" 
          value="₹1,25,000" 
          color="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>}
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Student Distribution Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Student Distribution per Program</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={programStudentData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} />
                            <Tooltip
                                cursor={{fill: 'rgba(254, 226, 226, 0.5)'}}
                                contentStyle={tooltipStyle}
                            />
                            <Legend wrapperStyle={{ color: tickColor }} />
                            <Bar dataKey="students" fill="#dc2626" name="No. of Students" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {/* Weekly Conversion Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Weekly Conversion Trend</h3>
                <div style={{ width: '100%', height: 300 }}>
                     <ResponsiveContainer>
                        <LineChart data={weeklyConversionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: tickColor }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} />
                            <Tooltip 
                                 contentStyle={tooltipStyle}
                            />
                            <Legend wrapperStyle={{ color: tickColor }} />
                            <Line type="monotone" dataKey="enrolled" stroke="#dc2626" strokeWidth={2} name="Students Enrolled" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
        
        {/* Employee Leaderboard */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Top Performers</h3>
            <div className="space-y-4">
                {employeeConversionCounts.map((emp, index) => (
                     <div key={emp.employeeId} className="flex items-center">
                        <div className={`text-lg font-bold w-8 text-center ${index < 3 ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                            #{index + 1}
                        </div>
                        <div className="ml-4">
                            <p className="font-semibold text-slate-800 dark:text-white">{emp.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{emp.conversions} conversions</p>
                        </div>
                    </div>
                ))}
                 {employeeConversionCounts.length === 0 && (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-4">No student conversions recorded yet.</p>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;