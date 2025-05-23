import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./utils/protected_route";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Development from "./pages/Development";
import RegisterToko from "./pages/RegisterToko";
import UpdateToko from "./pages/UpdateToko";
import CreateItem from "./pages/addProduct";
import "./styles/main.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/dev" element={<Development />} />
        <Route path="/register-toko" element={<RegisterToko />} />
        <Route path="/update-toko" element={<UpdateToko />} />
        <Route path="/add-product" element={<CreateItem />} />
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
