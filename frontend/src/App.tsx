import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Development from "./pages/Development";
import RegisterToko from "./pages/RegisterToko";
import UpdateToko from "./pages/UpdateToko";
import CreateItem from "./pages/RegisterProduct";
import ManageProduct from "./pages/ManageProduct";
import SellerHomepage from "./pages/SellerHomepage";
import ManageOrder from "./pages/ManageOrder";
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
        <Route path="/seller-homepage" element={<SellerHomepage />} />
        <Route path="/manage-product" element={<ManageProduct />} />
        <Route path="/manage-order" element={<ManageOrder />} />
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
