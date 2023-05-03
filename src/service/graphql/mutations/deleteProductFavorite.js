import { gql } from "@apollo/client";

const DELETE_PRODUCT_FAVORITE = gql`
  mutation ($favoriteId: Int!, $productId: Int!) {
    deleteProductFavorite(favorite_id: $favoriteId, product_id: $productId)
  }
`;

export default DELETE_PRODUCT_FAVORITE;
