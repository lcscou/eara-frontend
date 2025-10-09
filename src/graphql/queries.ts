import { gql } from '@apollo/client'
export const GetPagesWithBlock = gql`
  query GetPagesWithBlock {
    pages {
      nodes {
        title
        id
        uri
        blocks
      }
    }
  }
`

export const GetPost = gql`
  query GetPost($id: ID = "", $idType: PostIdType = URI) {
    post(id: $id, idType: $idType) {
      title
      content
      blocks
      author {
        node {
          lastName
          firstName
        }
      }
    }
  }
`

export const GetPage = gql`
  query GetPage($id: ID = "", $idType: PageIdType = URI) {
    page(id: $id, idType: $idType) {
      title
      content
      blocks
      author {
        node {
          lastName
          firstName
        }
      }
    }
  }
`

export const MenuItemFieldsFragment = gql`
  fragment MenuItemFields on MenuItem {
    id
    label
    uri
  }
`

export const GetMenu = gql`
  ${MenuItemFieldsFragment}
  query GetMenu {
    menus {
      nodes {
        locations
        menuItems(where: { parentId: "0" }) {
          nodes {
            ...MenuItemFields
            childItems {
              nodes {
                ...MenuItemFields
                childItems {
                  nodes {
                    ...MenuItemFields
                    childItems {
                      nodes {
                        ...MenuItemFields
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
