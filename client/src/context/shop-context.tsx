import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useGetProducts } from "../hooks/useGetProducts";
import { IProduct } from "../models/interfaces";
import axios from "axios";
import { useGetToken } from "../hooks/useGetToken";
import { ProductErrors } from "../models/errors";

export interface IShopContext {
  addToCart: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemCount: (newAmount: number, itemId: string) => void;
  getCartItemCount: (itemId: string) => number;
  totalInCart: () => number;
  getTotalCartAmount: () => number;
  checkout: () => void;
  availableMoney: number;
  purchasedItems: IProduct[];
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setCartItems: (cartItems: { string: number } | {}) => void;
  setTotalAmount: (totalAmount: number) => void;
  setPurchasedItems: (purchasedItems: IProduct[]) => void;
}

const defaultVal: IShopContext = {
  addToCart: () => null,
  removeFromCart: () => null,
  updateCartItemCount: () => null,
  getCartItemCount: () => 0,
  totalInCart: () => 0,
  getTotalCartAmount: () => 0,
  checkout: () => null,
  availableMoney: 0,
  purchasedItems: [],
  isAuthenticated: false,
  setIsAuthenticated: () => null,
  setCartItems: () => null,
  setTotalAmount: () => null,
  setPurchasedItems: () => null,
};

export const ShopContext = createContext<IShopContext>(defaultVal);

export const ShopContextProvider = (props) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<{ string: number } | {}>({});
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [availableMoney, setAvailableMoney] = useState<number>(0);
  const [purchasedItems, setPurchasedItems] = useState<IProduct[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [cookies, _] = useCookies(["access_token"]);
  const { products } = useGetProducts();
  const { headers } = useGetToken();
  const userID = localStorage.getItem("userID");

  const fetchAvailableMoney = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/user/availableMoney/${userID}`,
        { headers }
      );
      setAvailableMoney(res.data.availableMoney);
    } catch (error) {
      alert("ERROR: Something went wrong");
    }
  };

  const fetchPurchasedItems = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/product/purchasedItems/${userID}`,
        { headers }
      );
      setPurchasedItems(res.data.purchasedItems);
    } catch (error) {
      alert("ERROR: Something went wrong");
    }
  };

  const addToCart = (itemId: string) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    setTotalAmount(totalAmount + 1);
  };

  const removeFromCart = (itemId: string) => {
    if (!cartItems[itemId]) return;
    if (cartItems[itemId] == 0) return;
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    setTotalAmount(totalAmount - 1);
  };

  const updateCartItemCount = (newAmount: number, itemId: string) => {
    if (!cartItems[itemId]) return;
    if (newAmount < 0) return;
    setTotalAmount(totalAmount + newAmount - cartItems[itemId]);
    setCartItems((prev) => ({ ...prev, [itemId]: newAmount }));
  };

  const getCartItemCount = (itemId: string): number => {
    if (itemId in cartItems) {
      return cartItems[itemId];
    }
    return 0;
  };

  const totalInCart = () => {
    return totalAmount;
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo: IProduct = products.find(
          (product) => product._id === item
        );
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const checkout = async () => {
    const body = { customerID: localStorage.getItem("userID"), cartItems };
    try {
      await axios.post("http://localhost:3001/product/checkout", body, {
        headers,
      });
      setCartItems({});
      setTotalAmount(0);
      fetchAvailableMoney();
      fetchPurchasedItems();
      navigate("/");
    } catch (err) {
      let errorMessage: string = "";
      switch (err.response.data.type) {
        case ProductErrors.NO_PRODUCT_FOUND:
          errorMessage = "No product found";
          break;
        case ProductErrors.NO_AVAILABLE_MONEY:
          errorMessage = "Not enough money";
          break;
        case ProductErrors.NOT_ENOUGH_STOCK:
          errorMessage = "Not enough stock";
          break;
        default:
          errorMessage = "Something went wrong";
      }

      alert("ERROR: " + errorMessage);
    }
  };

  useEffect(() => {
    if (cookies.access_token) {
      setIsAuthenticated(true);
    }
  }, []);
  useEffect(() => {
    if (isAuthenticated) {
      fetchAvailableMoney();
      fetchPurchasedItems();
    }
  }, [isAuthenticated]);

  const conextVal: IShopContext = {
    addToCart,
    removeFromCart,
    updateCartItemCount,
    getCartItemCount,
    totalInCart,
    getTotalCartAmount,
    checkout,
    availableMoney,
    purchasedItems,
    isAuthenticated,
    setIsAuthenticated,
    setCartItems,
    setTotalAmount,
    setPurchasedItems,
  };

  return (
    <ShopContext.Provider value={conextVal}>
      {props.children}
    </ShopContext.Provider>
  );
};
