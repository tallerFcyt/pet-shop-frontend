import { gql } from "@apollo/client";

const CREATE_PRODUCT_FAVORITE = gql`
  mutation ($favoriteId: Int!, $productId: Int!) {
    createProductFavorite(favorite_id: $favoriteId, product_id: $productId)
  }
`;

export default CREATE_PRODUCT_FAVORITE;
