import { useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useGetProducts } from "../../hooks/useGetProducts";
import { IShopContext, ShopContext } from "../../context/shop-context";
import { IProduct } from "../../models/interfaces";
import { CartItem } from "./cartItem";
import "./styles.css";

export const CheckoutPage = () => {
  const { getCartItemCount, getTotalCartAmount, checkout, isAuthenticated } =
    useContext<IShopContext>(ShopContext);
  const navigate = useNavigate();
  const { products } = useGetProducts();
  const totalAmount = getTotalCartAmount();
  return (
    <div className="cart">
      {!isAuthenticated && <Navigate to="/auth" />}
      <div>
        <h1>Your Cart Items:</h1>
      </div>
      <div className="cart">
        {products.map((product: IProduct) => {
          if (getCartItemCount(product._id)) {
            return <CartItem product={product} />;
          }
        })}
      </div>
      {totalAmount > 0 ? (
        <div className="checkout">
          <p>Subtotal: ${totalAmount.toFixed(2)}</p>
          <button
            onClick={() => {
              navigate("/");
            }}
          >
            Continue Shopping
          </button>
          <button
            onClick={() => {
              checkout();
            }}
          >
            Checkout
          </button>
        </div>
      ) : (
        <h1>Your cart is empty</h1>
      )}
    </div>
  );
};
