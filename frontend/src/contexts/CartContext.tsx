import { createContext, useContext, useState, useEffect, useRef } from "react";
import type { PropsWithChildren } from "react";
import type { CartItem } from "../interfaces/CartItem";

interface CartItemWithSelected extends CartItem {
  selected: boolean;
}

interface CartContextType {
  cartItems: CartItemWithSelected[];
  addToCart: (item: CartItem, selected?: boolean) => void;
  removeFromCart: (itemId: string) => void;
  getFromCart: (itemId: string | number) => CartItemWithSelected | undefined;
  editCartItem: (itemId: string, quantity: number) => void;
  setItemSelected: (itemId: string, selected: boolean) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  getFromCart: () => undefined,
  editCartItem: () => {},
  setItemSelected: () => {},
  clearCart: () => {},
});

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }: PropsWithChildren<{}>) => {
  const [cartItems, setCartItems] = useState<CartItemWithSelected[]>([]);

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

  const clearCart = () => {
    setCartItems([]);
    return;
  };

  const addToCart = (item: CartItem, selected: boolean = false) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.barangId === item.barangId
    );

    if (existingItemIndex > -1) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
      setCartItems(updatedItems);
      return;
    }

    setCartItems((prevItems) => [...prevItems, { ...item, selected }]);
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

  const setItemSelected = (itemId: string, selected: boolean) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.barangId === itemId ? { ...item, selected } : item
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
        setItemSelected,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
