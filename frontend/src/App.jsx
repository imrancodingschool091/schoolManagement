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
import Loading from "./common/Loding";
import LibraryEdit from "./ui/library/LibraryEdit";
import LibraryAdd from "./ui/library/LibraryAdd";

// 👇 Example loader component (you can replace this with your own)
const Loader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', fontSize: '24px'
  }}>
    Loading...
  </div>
);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay (you can also check auth/token here)
    const timer = setTimeout(() => setLoading(false), 1500); // 1.5 seconds
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
         
        <Route path="/dashboard/admin/staffs" element={<Staffs />} />
        <Route path="/dashboard/admin/fees" element={<Fees />} />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
