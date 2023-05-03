import { gql } from "@apollo/client";

const GET_ALL_SERVICE_PET = gql`
query($serviceId: Int!, $userId: String!){
  getServiceByUser(service_id: $serviceId, user_id: $userId) {
    id,
    price,
    service_id,
    pet_id,
    start_date,
    ending_date,
    pet {
      name,
      type,
      user {
        name,
        lastName,
      }
    }
  }
}
`

export default GET_ALL_SERVICE_PET;