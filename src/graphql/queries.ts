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
  query GetPage($id: ID = "") {
    page(id: $id, idType: URI) {
      id
      title
      blocks
      date
      author {
        node {
          name
          firstName
          lastName
          nicename
        }
      }
      slug
      seo {
        readingTime
        opengraphDescription
        breadcrumbs {
          text
          url
        }
      }
      content
      featuredImage {
        node {
          guid
          altText
          title
        }
      }
    }
  }
`
export const GetAnimal = gql`
  query GetAnimal($id: ID = "") {
    animal(id: $id, idType: URI) {
      id
      title
      date
      author {
        node {
          name
          firstName
          lastName
          nicename
        }
      }
      blocks
      slug
      seo {
        readingTime
        opengraphDescription
        breadcrumbs {
          text
          url
        }
      }
      content
      featuredImage {
        node {
          guid
          altText
          title
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
    menuAcf {
      content
      fieldGroupName
      hidden
      ismegamenu
    }
    menuGeral {
      menuTextColor
    }
  }
`
export const GetMenu = gql`
  ${MenuItemFieldsFragment}
  query GetMenu {
    menus {
      nodes {
        menuGeral {
          menuTextColor
        }
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

export const GetNews = gql`
  query GetNews($id: ID = "") {
    news(id: $id, idType: URI) {
      id
      title
      blocks
      date
      author {
        node {
          name
          firstName
          lastName
          nicename
        }
      }
      slug
      seo {
        readingTime
        opengraphDescription
        breadcrumbs {
          text
          url
        }
      }
      content
      featuredImage {
        node {
          guid
          altText
          title
        }
      }
    }
  }
`
export const GetEvents = gql`
  query GetEvents($id: ID = "") {
    events(id: $id, idType: URI) {
      id
      title
      blocks
      date
      author {
        node {
          name
          firstName
          lastName
          nicename
        }
      }
      slug
      seo {
        readingTime
        opengraphDescription
        breadcrumbs {
          text
          url
        }
      }
      content
      featuredImage {
        node {
          guid
          altText
          title
        }
      }
    }
  }
`
export const GetAllEvents = gql`
  query GetAllEvents($first: Int, $after: String) {
    allEvents(first: $first, after: $after) {
      nodes {
        id
        title
        uri
        customFields {
          startDate
          location
          order
          endDate
        }
        featuredImage {
          node {
            guid
          }
        }
      }
    }
  }
`
export const GetDiseases = gql`
  query GetDiseases($id: ID = "") {
    diseases(id: $id, idType: URI) {
      id
      title
      blocks
      date
      author {
        node {
          name
          firstName
          lastName
          nicename
        }
      }
      slug
      seo {
        readingTime
        opengraphDescription
        breadcrumbs {
          text
          url
        }
      }
      content
      featuredImage {
        node {
          guid
          altText
          title
        }
      }
    }
  }
`
export const GetMembers = gql`
  query GetMembers($id: ID = "") {
    member(id: $id, idType: URI) {
      id
      title
      blocks
      date
      author {
        node {
          name
          firstName
          lastName
          nicename
        }
      }
      slug
      seo {
        readingTime
        opengraphDescription
        breadcrumbs {
          text
          url
        }
      }
      content
      featuredImage {
        node {
          guid
          altText
          title
        }
      }
    }
  }
`
