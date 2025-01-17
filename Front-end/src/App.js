import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

// Admin Routes
import Login from './components/pages/Login/Login';
import Admin from './components/pages/Admin/Admin';
import AdminCommunityService from './components/pages/CommunityService/CommunityService';
import AdminStudentProfile from './components/pages/StudentProfile/StudentProfile';
import AdminManageStudent from './components/pages/ManageStudent/ManageStudent';
import Reports from './components/pages/Reports/Reports';
import AdminManagePersonInCharge from './components/pages/ManagePerson/ManagePerson';
import AdminManageViolation from './components/pages/Violation/Violation';

// Super Admin Routes
import SuperAdmin from './components/pages/SuperAdmin/SuperAdmin'; 
import SuperAdminManageStudent from './components/pages/SuperAdmin/ManageStudent/ManageStudent'; 
import SuperAdminStudentProfile from './components/pages/SuperAdmin/StudentProfile/StudentProfile'; 
import SuperAdminCommunityService from './components/pages/SuperAdmin/CommunityService/CommunityService'; 
import ManageAdmin from './components/pages/SuperAdmin/ManageAdmin/ManageAdmin'; 
import SuperAdminReports from './components/pages/SuperAdmin/Reports/Reports';
import SuperAdminManagePersonInCharge from './components/pages/SuperAdmin/ManagePerson/ManagePerson';
import ManageViolation from './components/pages/SuperAdmin/ManageViolation/ManageViolation';

// Person In Charge Routes
import PersonInCharge from './components/pages/PersonInCharge/PersonInCharge';
import PersonInChargeManageStudent from './components/pages/PersonInCharge/ManageStudent/ManageStudent';

// Student Routes
import Student from './components/pages/Student/Student';
import StudentProfile from './components/pages/Student/Profile/Profile';
import ViewFileReport from './components/pages/SuperAdmin/ViewFileReport/ViewFileReport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/communityservice" element={<AdminCommunityService />} />
        <Route path="/student-profile" element={<AdminStudentProfile />} />
        <Route path="/manage-student" element={<AdminManageStudent />} />
        <Route path="/view-reports" element={<Reports />} />
        <Route path="/manage-person-in-charge" element={<AdminManagePersonInCharge />} />
        <Route path="/file-report" element={<AdminManageViolation />} />

        {/* Super Admin Routes */}
        <Route path="/super-admin" element={<SuperAdmin />} />
        <Route path="/super-admin/manage-admin" element={<ManageAdmin />} />
        <Route path="/super-admin/student-profile" element={<SuperAdminStudentProfile />} />
        <Route path="/super-admin/manage-student" element={<SuperAdminManageStudent />} />
        <Route path="/super-admin/communityservice" element={<SuperAdminCommunityService />} />
        <Route path="/super-admin/reports" element={<SuperAdminReports />} />
        <Route path="/super-admin/manage-person-in-charge" element={<SuperAdminManagePersonInCharge />} />
        <Route path="/super-admin/view-file-report" element={<ViewFileReport />} />
        <Route path="/super-admin/manage-violations" element={<ManageViolation />} />

         {/* Person In Charge Routes */}
         <Route path="/personincharge" element={<PersonInCharge />} />
         <Route path="/personincharge/manage-student" element={<PersonInChargeManageStudent />} />

         {/* Student Routes */}
         <Route path="/Student" element={<Student/>} />
         <Route path="/Profile" element={<StudentProfile/>} />

        {/* Redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
