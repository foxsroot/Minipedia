import { createContext, useContext, useState, useEffect, useRef } from "react";
import type { PropsWithChildren } from "react";
import type { CartItem } from "../interfaces/CartItem";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  getFromCart: (itemId: string | number) => CartItem | undefined;
  editCartItem: (itemId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  getFromCart: () => undefined,
  editCartItem: () => {},
});

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }: PropsWithChildren<{}>) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        } else {
          setCartItems([]);
          localStorage.removeItem("cartItems");
        }
      } catch (e) {
        setCartItems([]);
        localStorage.removeItem("cartItems");
      }
    }
  }, []);

  // Prevent overwriting localStorage on first render
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const getFromCart = (itemId: string | number) => {
    return cartItems.find((item) => String(item.barangId) === String(itemId));
  };

  const addToCart = (item: CartItem) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.barangId === item.barangId
    );

    if (existingItemIndex > -1) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
      setCartItems(updatedItems);
      return;
    }

    setCartItems((prevItems) => [...prevItems, item]);
  };

  const removeFromCart = (itemId: string | number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.barangId !== itemId)
    );
  };

  const editCartItem = (itemId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.barangId === itemId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        getFromCart,
        editCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
