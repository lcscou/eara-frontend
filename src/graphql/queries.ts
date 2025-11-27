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
export const GetAllAnimals = gql`
  query GetAllAnimals($first: Int, $after: String, $before: String, $last: Int) {
    animals(first: $first, after: $after, before: $before, last: $last) {
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      nodes {
        id
        uri
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
export const PageInfoFragment = gql`
  fragment PageInfo on PageInfo {
    endCursor
    startCursor
    hasNextPage
    hasPreviousPage
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
export const GetAllNews = gql`
  query GetAllNews($first: Int, $after: String, $before: String, $last: Int) {
    allNews(first: $first, after: $after, before: $before, last: $last) {
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      nodes {
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
        acfNews {
          earaMember
          disease {
            nodes {
              id
              slug
            }
          }
          country
          animal {
            nodes {
              id
              slug
            }
          }
        }
        categoriesNews {
          nodes {
            slug
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
      customFields {
        endDate
        location
        order
        organizer
        startDate
        category
        description
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
  query GetAllEvents(
    $category: String
    $organizer: String
    $search: String
    $last: Int
    $first: Int
    $before: String
    $after: String
  ) {
    allEvents(
      where: { category: $category, organizer: $organizer, search: $search }
      last: $last
      first: $first
      after: $before
      before: $after
    ) {
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      nodes {
        id
        title
        uri
        customFields {
          startDate
          location
          country
          order
          organizer
          endDate
          category
          description
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
export const GetAllDiseases = gql`
  query GetAllDiseases($first: Int, $after: String, $before: String, $last: Int) {
    allDiseases(first: $first, after: $after, before: $before, last: $last) {
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      nodes {
        id
        title
        blocks
        uri
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
export const GetSettings = gql`
  query GetSettings {
    earaSettings {
      themeSettings {
        mediabankIntro
      }
    }
  }
`
export const GetAllMembers = gql`
  query GetAllMembers($first: Int, $after: String, $before: String, $last: Int, $country: String) {
    members(
      first: $first
      after: $after
      before: $before
      last: $last
      where: { country: $country }
    ) {
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      nodes {
        id
        title
        acfMembers {
          country
          website
        }
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
  }
`
export const GetMediasBank = gql`
  query GetMediasBank(
    $first: Int = 23
    $after: String
    $before: String
    $last: Int
    $speciesFeatured: String
  ) {
    mediasBank(
      first: $first
      after: $after
      before: $before
      last: $last

      where: { orderby: { field: DATE, order: ASC }, speciesFeatured: $speciesFeatured }
    ) {
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      nodes {
        id
        slug
        uri
        cfMediaBank {
          banner
          mediaType
          credits
          creditWebsite
          creditsMoreInfo
          description
          email
          image {
            node {
              mediaDetails {
                width
                height
              }
              altText
              caption
              guid
            }
          }
          institution
          location
          videoUrl
          speciesFeaturedOrNewApproachMethodology
          uploadedDate
          researchArea
        }
      }
    }
  }
`
export const GetAllCaseStudies = gql`
  query GetAllCaseStudies(
    $first: Int
    $after: String
    $before: String
    $last: Int
    $institution: String
  ) {
    allCaseStudies(
      first: $first
      after: $after
      before: $before
      last: $last
      where: { institution: $institution }
    ) {
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      nodes {
        id
        title
        blocks
        date
        uri
        author {
          node {
            name
            firstName
            lastName
            nicename
          }
        }
        institution {
          nodes {
            name
            acfTaxonomyInstitution {
              website
            }
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
  }
`
export const GetCaseStudies = gql`
  query GetCaseStudies($id: ID!) {
    caseStudies(id: $id, idType: URI) {
      id
      title
      blocks
      date
      institution {
        nodes {
          name
          acfTaxonomyInstitution {
            website
          }
        }
      }
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
export const GetTeam = gql`
  query GetTeam($id: ID!) {
    team(id: $id, idType: URI) {
      id
      title
      blocks
      date
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

export const GetAllTeam = gql`
  query GetAllTeam($first: Int, $after: String, $before: String, $last: Int) {
    allTeams(first: $first, after: $after, before: $before, last: $last) {
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      nodes {
        id
        title
        blocks
        date
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
  }
`
