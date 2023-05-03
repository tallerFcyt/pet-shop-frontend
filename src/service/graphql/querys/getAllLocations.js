import { gql } from "@apollo/client";

const GET_ALL_LOCATIONS = gql`
query($provinceId: Int!){
  getAllLocation(province_id: $provinceId) {
    id
    name
  }
}
`;

export default GET_ALL_LOCATIONS;