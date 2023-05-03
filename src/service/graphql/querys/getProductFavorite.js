import { gql } from "@apollo/client";

const GET_PRODUCT_FAVORITE = gql`
  query($favoriteId: Int!, $productId: Int!){
    getProductFavorite(favorite_id: $favoriteId, product_id: $productId) {
      favorite_id,
      product_id
    }
  }
`

export default GET_PRODUCT_FAVORITE;