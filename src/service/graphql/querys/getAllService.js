import { gql } from "@apollo/client";

const GET_ALL_SERVICE = gql`
  query {
    getAllService{
      id,
      title,
      price,
      description,
      image_url,
      active
    }
  }
`

export default GET_ALL_SERVICE;