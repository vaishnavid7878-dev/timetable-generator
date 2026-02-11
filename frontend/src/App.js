import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Teachers from "./pages/Teachers";
import Classroom from "./pages/Classroom";
import Division from "./pages/Division";
import Labs from "./pages/Labs";
import Subjects from "./pages/Subjects";
import Allocation from "./pages/Allocation";
import Constraints from "./pages/Constraints";
import Generate from "./pages/Generate";

function App() {
  return (
    <Router>
      <Routes>
        {/* First page */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* After login */}
        <Route path="/dashboard" element={<Dashboard />} >
          <Route path="profile" element={<Profile />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="classrooms" element={<Classroom />} />
          <Route path="divisions" element={<Division />} />
          <Route path="labs" element={<Labs />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="allocation" element={<Allocation />} />
          <Route path="constraints" element={<Constraints />} />
          <Route path="generate" element={<Generate />} />
        </Route> 
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;
