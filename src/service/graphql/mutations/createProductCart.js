import { gql } from "@apollo/client";

const CREATE_PRODUCT_CART = gql`
  mutation($quantity: Int!, $total: Float!, $productId: Int!, $userId: String!){
  createProductCart(quantity: $quantity, total: $total, product_id: $productId, user_id: $userId)
}
`;

export default CREATE_PRODUCT_CART;