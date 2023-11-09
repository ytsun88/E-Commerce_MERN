import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { IShopContext, ShopContext } from "../context/shop-context";
import { Badge } from "@mui/material";

export const Navbar = () => {
  const {
    totalInCart,
    availableMoney,
    isAuthenticated,
    setIsAuthenticated,
    setCartItems,
    setTotalAmount,
    setPurchasedItems,
  } = useContext<IShopContext>(ShopContext);
  const [_, setCookies] = useCookies(["access_token"]);
  const logout = () => {
    localStorage.clear();
    setCookies("access_token", null);
    setIsAuthenticated(false);
    setCartItems({});
    setTotalAmount(0);
    setPurchasedItems([]);
  };
  return (
    <div className="navbar">
      <div className="navbar-title">
        <h1>YT Shop</h1>
      </div>
      <div className="navbar-links">
        <Link to="/">Shop</Link>
        {isAuthenticated && <Link to="/purchased-items">Purchases</Link>}
        <Link to="/checkout">
          <Badge badgeContent={totalInCart()} color="primary">
            <FontAwesomeIcon icon={faShoppingCart} />
          </Badge>
        </Link>
        {!isAuthenticated && <Link to="/auth">Login</Link>}
        {isAuthenticated && (
          <>
            <Link to="/auth" onClick={logout}>
              Logout
            </Link>
            <span>${availableMoney.toFixed(2)}</span>
          </>
        )}
      </div>
    </div>
  );
};
