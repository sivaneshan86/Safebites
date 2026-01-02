// contexts/UserContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [familyMembers, setFamilyMembers] = useState([]);

  // Load all persisted data on initial mount
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        setIsLoading(true);
        const [userData, cartData, familyData] = await Promise.all([
          AsyncStorage.getItem("@userData"),
          AsyncStorage.getItem("@cart"),
          AsyncStorage.getItem("@familyData"),
        ]);

        if (userData) setUserData(JSON.parse(userData));
        if (cartData) setCart(JSON.parse(cartData));
        if (familyData) setFamilyMembers(JSON.parse(familyData));
      } catch (e) {
        console.error("Failed to load persisted data", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersistedData();
  }, []);

  // Persist user data whenever it changes
  useEffect(() => {
    const saveUserData = async () => {
      if (userData === null) return;

      try {
        await AsyncStorage.setItem("@userData", JSON.stringify(userData));
      } catch (e) {
        console.error("Failed to save user data", e);
      }
    };

    saveUserData();
  }, [userData]);

  // Persist cart whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem("@cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart", e);
      }
    };

    saveCart();
  }, [cart]);

  // Update both when family members change
  useEffect(() => {
    if (familyMembers.length > 0) {
      saveFamilyData(familyMembers);
    }
  }, [familyMembers, saveFamilyData]);

  // Save family data separately
  const saveFamilyData = useCallback(async (members) => {
    try {
      await AsyncStorage.setItem("@familyData", JSON.stringify(members));
    } catch (e) {
      console.error("Failed to save family data", e);
    }
  }, []);

  // Stable reference addToCart function
  const addToCart = useCallback(async (item) => {
    setCart((prevCart) => {
      // Prevent duplicates
      const exists = prevCart.some(
        (cartItem) => cartItem.barcode === item.barcode
      );
      if (exists) return prevCart;

      const newCart = [...prevCart, item];
      AsyncStorage.setItem("@cart", JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  // Stable reference removeFromCart function
  const removeFromCart = useCallback(async (barcode) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.barcode !== barcode);
      AsyncStorage.setItem("@cart", JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  // Clear all cart items
  const clearCart = useCallback(async () => {
    setCart([]);
    await AsyncStorage.removeItem("@cart");
  }, []);

  // Update cart item quantity
  const updateCartItem = useCallback(async (barcode, updates) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item.barcode === barcode ? { ...item, ...updates } : item
      );
      AsyncStorage.setItem("@cart", JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  // Value to provide to consumers
  const contextValue = {
    userData,
    setUserData,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItem,
    isLoading,
    familyMembers,
    setFamilyMembers,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
