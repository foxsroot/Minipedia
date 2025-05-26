import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Development from "./pages/Development";
import RegisterToko from "./pages/RegisterToko";
import UpdateToko from "./pages/UpdateToko";
import CreateItem from "./pages/RegisterProduct";
import UpdateProduct from "./pages/UpdateProduct";
import ManageProduct from "./pages/ManageProduct";
import SellerHomepage from "./pages/SellerHomepage";
import ManageOrder from "./pages/ManageOrder";
import "./styles/main.css";
import ProductDetail from "./pages/ProductDetail";
import { CartProvider } from "./contexts/CartContext";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/dev" element={<Development />} />
          <Route path="/register-toko" element={<RegisterToko />} />
          <Route path="/update-toko" element={<UpdateToko />} />
          <Route path="/add-product" element={<CreateItem />} />
          <Route path="/edit-product/:id" element={<UpdateProduct />} />
          <Route path="/seller-homepage" element={<SellerHomepage />} />
          <Route path="/manage-product" element={<ManageProduct />} />
          <Route path="/manage-order" element={<ManageOrder />} />
          <Route path="/product/:barangId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
