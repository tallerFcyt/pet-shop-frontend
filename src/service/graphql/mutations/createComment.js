import { gql } from "@apollo/client";

const CREATE_COMMENT = gql`
  mutation ($comment: String!, $userId: String!, $productId: Int!) {
    createComment(comment: $comment, user_id: $userId, product_id: $productId)
  }
`;

export default CREATE_COMMENT;
