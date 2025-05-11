import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AdminHeader from "./ui/admin/AdminHeader";
import LibraryHistory from "./ui/library/LibraryHistory";
import Students from "./ui/student/Students";
import Staffs from "./ui/staff/Staffs";
import Fees from "./ui/fees/Fees";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Create from "./ui/student/Create";
import View from "./ui/student/View";
import Edit from "./ui/student/Edit";
import LibraryEdit from "./ui/library/LibraryEdit";
import LibraryAdd from "./ui/library/LibraryAdd";
import FeesAdd from "./ui/fees/FeesAdd";
import FeesEdit from "./ui/fees/FeesEdit";
import StaffsAdd from "./ui/staff/StaffsAdd";
import StaffsEdit from "./ui/staff/StaffsEdit";

// Custom animated loading component
const Loading = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'flex',
        marginBottom: '20px'
      }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            width: '15px',
            height: '15px',
            margin: '0 5px',
            backgroundColor: 'white',
            borderRadius: '50%',
            animation: `bounce 1.5s infinite ease-in-out`,
            animationDelay: `${i * 0.1}s`
          }} />
        ))}
      </div>
      <h1 style={{
        fontSize: '2rem',
        marginBottom: '10px',
        fontWeight: '600'
      }}>Loading Your Dashboard</h1>
      <p style={{
        fontSize: '1rem',
        opacity: '0.8'
      }}>Please wait while we prepare everything for you</p>
      
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading/>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/admin" element={<AdminHeader />} />
        <Route path="/dashboard/admin/students" element={<Students />} />
        <Route path="/dashboard/admin/student/add" element={<Create />} />
        <Route path="/dashboard/admin/student/view/:id" element={<View />} />
        <Route path="/dashboard/admin/student/edit/:id" element={<Edit />} />
        <Route path="/dashboard/admin/libraryHistory" element={<LibraryHistory />} />
        <Route path="/dashboard/admin/library/add" element={<LibraryAdd />} />
        <Route path="/dashboard/admin/library/edit/:id" element={<LibraryEdit />} />
        <Route path="/dashboard/admin/fees" element={<Fees />} />
        <Route path="/dashboard/admin/fees/add" element={<FeesAdd />} />
        <Route path="/dashboard/admin/fees/edit/:id" element={<FeesEdit/>} />
        <Route path="/dashboard/admin/staff" element={<Staffs />} />
        <Route path="/dashboard/admin/staff/add" element={<StaffsAdd />} />
        <Route path="/dashboard/admin/staff/edit/:id" element={<StaffsEdit />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;