import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./utils/protected_route";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Development from "./pages/Development";
import "./styles/main.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/dev" element={<Development />} />
        {/* 
        <Route path="/u/:username" element={
          <ProtectedRoute>
            <ViewProfile />
          </ProtectedRoute>
        } />
        */}
      </Routes>
    </Router>
  );
};

export default App;
