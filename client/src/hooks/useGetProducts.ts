import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { IProduct } from "../models/interfaces";
import { IShopContext, ShopContext } from "../context/shop-context";
export const useGetProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const { isAuthenticated } = useContext<IShopContext>(ShopContext);
  const fetchProducts = async () => {
    try {
      const fetchedProducts = await axios.get("http://localhost:3001/product");
      setProducts(fetchedProducts.data.products);
    } catch (error) {
      alert("ERROR: Something went wrong");
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return { products };
};
