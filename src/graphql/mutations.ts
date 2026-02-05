import { gql } from '@apollo/client'

export const Login = gql`
  mutation Login($username: String!, $password: String!) {
    login(
      input: { provider: PASSWORD, credentials: { username: $username, password: $password } }
    ) {
      authToken
      authTokenExpiration
      clientMutationId
      refreshToken
      user {
        firstName
      }
      refreshTokenExpiration
    }
  }
`
