<a href="https://www.owlracle.com">
  <p align="center">
    <img alt="Owracle - LLM develped by Nice Team." src="./components/images/owlracleLogo.png" width="163" height="89">
  </p>
  <h1 align="center">Owlracle</h1>
</a>

<p align="center">
  An open-source LLM chatbot that answers Rice students' questions.
</p>

<p align="center">
  <a href="https://docs.owlracle.com/" target="_blank">
      <img src="https://img.shields.io/badge/docs-view-red" alt="Documentation">
  </a>
  
  <a href="https://discord.com/invite/aHRxTK5jHG" target="_blank">
      <img src="https://img.shields.io/badge/discord-join-blue.svg?logo=discord&logoColor=white" alt="Discord">
  </a>

  <a href="mailto:yc127@rice.edu" target="_blank">
      <img src="https://img.shields.io/badge/email-contact-green" alt="Discord">
  </a>
</p>

<p align="center">
  <a href="#documentation"><strong>Documentation</strong></a> ·
  <a href="#Architecture"><strong>Architecture</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>LLM</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a> ·
  <a href="#authors"><strong>Authors</strong></a>
</p>
<br/>

## Documentation
Check our latest documentation [here](https://docs.owlracle.com/).

## Architecture
The application is 3 parts: llm, vectorDB, and server manager. The server manager constantly listens&scrapes various sources and updates the vectorDB. The sources include owlnest events, clubs instagram, and esther courses. In addition to these sources, all rice students can add new sources. For example, if there is a site posting finance career fair I want to share, I can do so within Owlracle using the functionality called Teaching. Then the server manager will automatically scrape that info and share it with the next student who asks about some relavent questions.

## Implementation
<ul>
  <li><a href="https://github.com/Open-Nice/Owlracle/tree/main/app/experts" target="_blank">Prompt Engineering</a>: codifies how LLM reasons about users question given provided contexts from VectorDB.</li>
  <li><a href="https://supabase.com/docs/guides/ai" target="_blank">Supabase VectorDB</a>: augments information retrieval for LLM.</li>
  <li><a href="https://modal.com/home" target="_blank">Modal</a>: manages(create, update, delete) VectorDB information.</li>
</ul>


## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Owlracle. If you're interested in joining us, join the [discord](https://discord.com/invite/aHRxTK5jHG) where we open sourced the env variables. After that, run following commmands:

```bash
pnpm i . #(run everytime to install new node modules)
npx prisma generate --data-proxy #(run only once)
pnpm dev #(run every time to start the app on local host)
```

Owlracle should now be running on [localhost:3000](http://localhost:3000/).

## Authors

This library is created by [NICE](https://github.com/Open-Nice) team members, with contributions from:

- Peter Cao ([Ye Cao](https://www.linkedin.com/in/ye-peter-cao-98870920b/)) -- organizer
- Alexia Huang ([Yuening Huang](https://www.linkedin.com/in/alexia-yuening-huang)) -- frontend
- Ningzhi Xu ([Ningzhi Xu](https://www.linkedin.com/in/ningzhi-xu-0914/)) -- backend
- Jinyu Pei ([Jinyu Pei](https://www.linkedin.com/in/jinyu-pei-b92b80249/)) -- backend
- Arihan Varanasi ([Arihan Varanasi](https://www.linkedin.com/in/arihanvaranasi/)) -- architecture & knowledge Retrieval
- Jasmine Lu ([Jasmine Lu](https://www.linkedin.com/in/jasmine-lu-b01b4726a/)) -- server manager
