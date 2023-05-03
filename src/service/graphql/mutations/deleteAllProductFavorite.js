import { gql } from "@apollo/client";

const DELETE_ALL_PRODUCT_FAVORITE = gql`
  mutation ($favoriteId: Int!) {
    deleteAllProductFavorite(favorite_id: $favoriteId)
  }
`;

export default DELETE_ALL_PRODUCT_FAVORITE;