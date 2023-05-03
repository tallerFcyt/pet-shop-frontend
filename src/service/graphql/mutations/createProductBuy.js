import { gql } from "@apollo/client";

const CREATE_PRODUCT_BUY = gql`
  mutation (
    $price: Float!
    $quantity: Int!
    $productId: Int!
    $buyId: String!
  ) {
    createProductBuy(
      price: $price
      quantity: $quantity
      product_id: $productId
      buy_id: $buyId
    )
  }
`;

export default CREATE_PRODUCT_BUY;
