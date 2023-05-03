import { gql } from "@apollo/client";

const GET_ALL_PROVINCES = gql`
  query {
    getAllProvince {
      id
      name
    }
  }
`;

export default GET_ALL_PROVINCES;
