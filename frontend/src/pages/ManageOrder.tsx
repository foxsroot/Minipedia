import SellerNavbar from "../components/SellerNavbar";
import SellerSidebar from "../components/SellerSidebar";

const ManageOrder = () => {
  return (
    <div>
      <SellerNavbar />
      <div style={{ display: "flex" }}>
        <SellerSidebar />
        <main style={{ flex: 1, padding: "2rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.5rem", marginBottom: 24 }}>
            Orders Management
          </h2>
          {/* Your order management table or content here */}
        </main>
      </div>
    </div>
  );
};

export default ManageOrder;