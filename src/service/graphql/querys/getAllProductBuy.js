import { gql } from "@apollo/client";

const GET_PRODUCT_BUY = gql`
  query (
    $userId: String
    $endDate: String
    $startDate: String
    $minTotalPrice: Float
    $maxTotalPrice: Float
    $stateId: Int
  ) {
    getAllProductBuy(
      user_id: $userId
      end_date: $endDate
      start_date: $startDate
      minTotalPrice: $minTotalPrice
      maxTotalPrice: $maxTotalPrice
      state_id: $stateId
    ) {
      buy {
        id
        address_id
        createdAt
        totalPrice
        shipment {
          id
          state_id
          arrival_date
          departure_date
          state {
            id
            name
          }
        }
        user {
          id
          name
          lastName
        }
      }
      products {
        product_id
        quantity
        price
        product {
          title
          description
          image_url
        }
      }
    }
  }
`;

export default GET_PRODUCT_BUY;
