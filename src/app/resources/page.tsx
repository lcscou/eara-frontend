export default async function MixedContentPage() {
  return <>...</>
}
// import { getClient, getAuthenticatedClient } from '@/lib/apollo-client'
// import { isAuthenticated } from '@/lib/auth/helpers'
// import { gql } from '@apollo/client'

// const PUBLIC_POSTS_QUERY = gql`
//   query GetPublicPosts {
//     posts(where: { status: PUBLISH }, first: 10) {
//       nodes {
//         id
//         title
//         excerpt
//         date
//         slug
//       }
//     }
//   }
// `

// const PRIVATE_POSTS_QUERY = gql`
//   query GetPrivatePosts {
//     posts(where: { status: PRIVATE }, first: 5) {
//       nodes {
//         id
//         title
//         excerpt
//         date
//         slug
//       }
//     }
//   }
// `

// export default async function MixedContentPage() {
//   const authenticated = await isAuthenticated()

//   // Buscar conteúdo público com o client padrão (com cache)
//   const publicClient = getClient()
//   const { data: publicData } = await publicClient.query({
//     query: PUBLIC_POSTS_QUERY,
//   })

//   // Buscar conteúdo privado apenas se o usuário estiver autenticado
//   let privateData = null
//   if (authenticated) {
//     const privateClient = await getAuthenticatedClient()
//     const result = await privateClient.query({
//       query: PRIVATE_POSTS_QUERY,
//     })
//     privateData = result.data
//   }

//   const publicPosts = publicData?.posts?.nodes || []
//   const privatePosts = privateData?.posts?.nodes || []

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-4xl font-bold mb-8">Recursos EARA</h1>

//       {/* Seção de Conteúdo Público */}
//       <section className="mb-12">
//         <h2 className="text-2xl font-semibold mb-4">Recursos Públicos</h2>
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {publicPosts.map((post) => (
//             <article key={post.id} className="border rounded-lg p-4 hover:shadow-md transition">
//               <h3 className="font-semibold mb-2">{post.title}</h3>
//               {post.excerpt && (
//                 <div
//                   className="text-sm text-gray-600 line-clamp-2"
//                   dangerouslySetInnerHTML={{ __html: post.excerpt }}
//                 />
//               )}
//               <time className="text-xs text-gray-500 block mt-2">
//                 {new Date(post.date).toLocaleDateString('pt-BR')}
//               </time>
//             </article>
//           ))}
//         </div>
//       </section>

//       {/* Seção de Conteúdo Privado */}
//       {authenticated ? (
//         <section>
//           <div className="flex items-center gap-2 mb-4">
//             <h2 className="text-2xl font-semibold">Recursos Exclusivos para Membros</h2>
//             <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
//               PRIVADO
//             </span>
//           </div>

//           {privatePosts.length > 0 ? (
//             <div className="grid gap-4 md:grid-cols-2">
//               {privatePosts.map((post) => (
//                 <article
//                   key={post.id}
//                   className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50 hover:shadow-md transition"
//                 >
//                   <div className="flex items-start justify-between">
//                     <h3 className="font-semibold mb-2">{post.title}</h3>
//                     <svg
//                       className="w-5 h-5 text-blue-600"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </div>
//                   {post.excerpt && (
//                     <div
//                       className="text-sm text-gray-700 line-clamp-2"
//                       dangerouslySetInnerHTML={{ __html: post.excerpt }}
//                     />
//                   )}
//                   <time className="text-xs text-gray-600 block mt-2">
//                     {new Date(post.date).toLocaleDateString('pt-BR')}
//                   </time>
//                 </article>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-600">
//               Não há recursos exclusivos disponíveis no momento.
//             </p>
//           )}
//         </section>
//       ) : (
//         <section className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//           <svg
//             className="w-12 h-12 text-gray-400 mx-auto mb-4"
//             fill="currentColor"
//             viewBox="0 0 20 20"
//           >
//             <path
//               fillRule="evenodd"
//               d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
//               clipRule="evenodd"
//             />
//           </svg>
//           <h3 className="text-xl font-semibold mb-2">Recursos Exclusivos para Membros</h3>
//           <p className="text-gray-600 mb-4">
//             Faça login para acessar conteúdo exclusivo e recursos premium.
//           </p>
//           <a
//             href="/login"
//             className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
//           >
//             Fazer Login
//           </a>
//         </section>
//       )}
//     </div>
//   )
// }
