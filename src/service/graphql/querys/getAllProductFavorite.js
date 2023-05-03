import { gql } from "@apollo/client";

const GET_ALL_PRODUCT_FAVORITE = gql`
  query($favoriteId: Int!){
    getAllProductFavorite(favorite_id: $favoriteId) {
      id,
      favorite_id,
      product_id
    }
  }
`

export default GET_ALL_PRODUCT_FAVORITE;