import { gql } from "@apollo/client";

const GET_ALL_COMMENTS = gql`
  query ($productId: Int!) {
    getAllComment(product_id: $productId) {
      id
      comment
      response
      comment_date
      response_date
      user_id
      user{
        name
        lastName
      }
    }
  }
`;

export default GET_ALL_COMMENTS;
