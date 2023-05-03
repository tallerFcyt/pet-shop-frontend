import { gql } from "@apollo/client";

const DELETE_PRODUCT_CART = gql`
  mutation ($userId: String!, $productId: Int!) {
    deleteProductCart(user_id: $userId, product_id: $productId)
  }
`;

export default DELETE_PRODUCT_CART;