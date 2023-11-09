import { useContext } from "react";

import { IProduct } from "../../models/interfaces";
import { IShopContext, ShopContext } from "../../context/shop-context";

interface Props {
  product: IProduct;
}

export const Product = (props: Props) => {
  const { _id, productName, description, price, stockQuantity, imageURL } =
    props.product;
  const { addToCart, getCartItemCount } = useContext<IShopContext>(ShopContext);
  const count = getCartItemCount(_id);
  return (
    <div className="product">
      <img src={imageURL} />
      <div className="description">
        <h3>{productName}</h3>
        <p>{description}</p>
        <p> ${price}</p>
      </div>
      {stockQuantity > 0 && (
        <button
          className="addToCartBttn"
          onClick={() => {
            addToCart(_id);
          }}
        >
          Add To Cart {count > 0 && <span>({count})</span>}
        </button>
      )}

      <div className="stockQuantity">
        {stockQuantity === 0 && <h4> OUT OF STOCK</h4>}
      </div>
    </div>
  );
};
