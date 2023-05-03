import { gql } from "@apollo/client"

const DELETE_ALL_PRODUCT_CART = gql`
  mutation ($userId: String!) {
    deleteAllProductCart(user_id: $userId)
  }
`;

export default DELETE_ALL_PRODUCT_CART;
