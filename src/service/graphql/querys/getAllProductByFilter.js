import { gql } from "@apollo/client";

const GET_ALL_PRODUCT_BY_FILTER = gql`
  query($filter: String!){
  getAllProductByFilter(filter: $filter) {
    id
    title
    description
    price
    stock
    image_url
    active
  }
}
`

export default GET_ALL_PRODUCT_BY_FILTER;