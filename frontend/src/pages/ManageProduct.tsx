import NavigationBar from "../components/NavigationBar";
import SellerSidebar from "../components/SellerSidebar";

const ManageProduct = () => {
  return (
    <div>
      <NavigationBar />
      <div style={{ display: "flex" }}>
        <SellerSidebar />
        <main style={{ flex: 1, padding: "2rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.5rem", marginBottom: 24 }}>
            Products Management
          </h2>
          {/* Your product management table or content here */}
        </main>
      </div>
    </div>
  );
};

export default ManageProduct;