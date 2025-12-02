import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [cartItemData, setCartItemData] = useState({});
  const [lastAddedItem, setLastAddedItem] = useState(null);

  const addToCart = useCallback((productOrId) => {
    setCartItems((prev) => {
      const productId =
        productOrId && typeof productOrId === 'object' ? productOrId.id : productOrId;
      if (!productId) {
        return prev;
      }
      const newCart = {
        ...prev,
        [productId]: (prev[productId] || 0) + 1,
      };
      return newCart;
    });
    if (productOrId && typeof productOrId === 'object') {
      setCartItemData((prev) => ({
        ...prev,
        [productOrId.id]: productOrId,
      }));
      setLastAddedItem(productOrId);
    }
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[productId] > 1) {
        updatedCart[productId] -= 1;
      } else {
        delete updatedCart[productId];
        // Also remove from cartItemData if quantity becomes 0
        setCartItemData((prevData) => {
          const updatedData = { ...prevData };
          delete updatedData[productId];
          return updatedData;
        });
      }
      return updatedCart;
    });
  }, []);

  const removeProductFromCart = useCallback((productId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      delete updatedCart[productId];
      return updatedCart;
    });
    // Also remove from cartItemData
    setCartItemData((prevData) => {
      const updatedData = { ...prevData };
      delete updatedData[productId];
      return updatedData;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems({});
    setCartItemData({});
  }, []);

  const getTotalItems = useCallback(() => {
    return Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback((allProducts) => {
    let total = 0;
    Object.entries(cartItems).forEach(([productId, quantity]) => {
      // First try to find in cartItemData (for services)
      const cartItem = cartItemData[productId];
      if (cartItem) {
        total += cartItem.price * quantity;
      } else {
        // Fall back to static products
        const product = allProducts.find((p) => p.id === productId);
        if (product) {
          total += product.price * quantity;
        }
      }
    });
    return total;
  }, [cartItems, cartItemData]);

  const getCartProducts = useCallback((allProducts) => {
    return allProducts.filter((product) => cartItems[product.id]).map((product) => ({
      ...product,
      quantity: cartItems[product.id],
    }));
  }, [cartItems]);

  const isInCart = useCallback((productId) => {
    return cartItems[productId] > 0;
  }, [cartItems]);

  const value = {
    cartItems,
    cartItemData,
    addToCart,
    removeFromCart,
    removeProductFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getCartProducts,
    isInCart,
    lastAddedItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
