import { gql } from "@apollo/client";

const GET_PRODUCT_BUY_BY_USER = gql`
  query($userId: String!){
  getProductBuyByUser(user_id: $userId){
    buy {
      id
      address_id
      createdAt
      totalPrice
      shipment {
        id,
        state_id,
        arrival_date
        departure_date,
        state {
          id
          name
        }
      }
    }
    products {
      product_id
      quantity,
      price,
      product {
        title,
        description,
        image_url
      }
    }
  }
}
`;

export default GET_PRODUCT_BUY_BY_USER;