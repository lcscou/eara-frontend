This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

https://developer.wordpress.org/block-editor/reference-guides/core-blocks/

<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3114.056940583907!2d-9.224007!3d38.6935363!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1ecb6efee9e7f1%3A0x93b51451a062a591!2sFunda%C3%A7%C3%A3o%20Champalimaud!5e0!3m2!1spt-BR!2sbr!4v1767964478528!5m2!1spt-BR!2sbr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

## Algolia global search

The header search uses the Algolia Search-only key directly from the browser (no proxy/routes). Configure these variables in `.env.local`:

```env
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=eara_global
# Optional: forces permalink replacement to the frontend domain
NEXT_PUBLIC_SITE_URL=https://example.com
```

- WordPress must index content in a single global index (via the official Algolia plugin).
- The Search-only key is the only Algolia credential used on the frontend.
- Permalinks returned by Algolia are normalized to the frontend domain at runtime.
