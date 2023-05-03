import { gql } from "@apollo/client";

const CREATE_BUY = gql`
  mutation (
    $createBuyId: String!
    $totalPrice: Float!
    $userId: String!
    $addressId: Int!
  ) {
    createBuy(
      id: $createBuyId
      totalPrice: $totalPrice
      user_id: $userId
      address_id: $addressId
    )
  }
`;

export default CREATE_BUY;
