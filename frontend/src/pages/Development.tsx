import ItemBox from "../components/ItemBox";

const Development = () => {
  return (
    <>
      <ItemBox
        imageUrl="https://images.tokopedia.net/img/cache/700/VqbcmM/2023/3/14/7ca184b3-1aa7-442a-9e7d-7651ac88037e.jpg"
        title="Wireless Bluetooth Headphones"
        price={250000}
        discount="20% OFF"
        onClick={() => alert("Item clicked!")}
      />
    </>
  );
};

export default Development;
