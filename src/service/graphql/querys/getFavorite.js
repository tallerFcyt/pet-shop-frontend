import { gql } from "@apollo/client";

const GET_FAVORITE = gql`
  query ($userId: String!) {
    getFavorite(user_id: $userId) {
      id
    }
  }
`;

export default GET_FAVORITE;
