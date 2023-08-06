<a href="https://www.owlracle.com">
  <p align="center">
    <img alt="Owracle - LLM develped by Nice Team." src="./components/images/owlracleLogo.png" width="163" height="89">
  </p>
  <h1 align="center">Owlracle</h1>
</a>

<p align="center">
  An open-source large language model (LLM) chatbot app built with Next.js, Vercel KV, Supabase, and Modal.
</p>

<p align="center">
  <a href="#documentation"><strong>Documentation</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>LLM</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a> ·
  <a href="#authors"><strong>Authors</strong></a>
</p>
<br/>

## Documentation
Check our latest documentation [here](https://owlracle-documentation-deploy.vercel.app/).

## Features

- [Next.js](https://nextjs.org) App Router
- React Server Components (RSCs), Suspense, and Server Actions
- [Vercel AI SDK](https://sdk.vercel.ai/docs) for streaming chat UI
- Support for OpenAI (default), Anthropic, Hugging Face, or custom AI chat models and/or LangChain
- Edge runtime-ready
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - [Radix UI](https://radix-ui.com) for headless component primitives
  - Icons from [Phosphor Icons](https://phosphoricons.com)
- Chat History, rate limiting, and session storage with [Vercel KV](https://vercel.com/storage/kv)
- [NextAuth.js](https://github.com/nextauthjs/next-auth) for authentication

## LLM
This LLM is built using `gpt-3.5-turbo`. We are working on migrating to fine-tuned Llama-v2: join us [here](https://github.com/Open-Nice/Owlracle-llama2.c).

## Creating a KV Database Instance

Follow the steps outlined in the [quick start guide](https://vercel.com/docs/storage/vercel-kv/quickstart#create-a-kv-database) provided by Vercel. This guide will assist you in creating and configuring your KV database instance on Vercel, enabling your application to interact with it.

Remember to update your environment variables (`KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`) in the `.env` file with the appropriate credentials provided during the KV database setup.


## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000/).

## Authors

This library is created by [NICE](https://github.com/Open-Nice) team members, with contributions from:

- Peter Cao ([Ye Cao](https://www.linkedin.com/in/ye-peter-cao-98870920b/))
- Alexia Huang ([Yuening Huang](https://www.linkedin.com/in/alexia-yuening-huang))
- Ningzhi Xu ([Ningzhi Xu](https://www.linkedin.com/in/ningzhi-xu-0914/))
- Jinyu Pei ([Jinyu Pei](https://www.linkedin.com/in/jinyu-pei-b92b80249/))
