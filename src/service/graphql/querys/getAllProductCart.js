import { gql } from "@apollo/client";

const GET_ALL_PRODUCT_CART = gql`
  query($userId: ID!){
  getProductCart(user_id: $userId) {
    product_id
    quantity
    total
    product{
      title
      description
      price
      stock
      image_url
    }
  }
}
`

export default GET_ALL_PRODUCT_CART;