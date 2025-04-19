
# 💻 OnlyCodes — The Dev-Only Social Network

> A modern, drama-free, full-stack social media platform for developers & programmers.  
> Built with React, TypeScript, SupaBase, TailwindCSS, and shadcn/ui.

![OnlyCodes Banner](./public/og-banner.png)

---

## 🚀 About

**OnlyCodes** is a Twitter-like platform for developers.  
No brain-rot. No drama. Just code, snippets, and software talk.

Built as a productivity-first social app to connect devs through clean UI, powerful tech, and real conversations.

---

## 🔧 Tech Stack

- ⚛️ React + TypeScript (Frontend)
- 🌬 TailwindCSS (Utility-first CSS)
- 🧱 shadcn/ui + Material UI (UI Components)
- 🛠 SupaBase (Auth, DB, Storage, Realtime)
- ✨ Framer Motion (Animations)
- 🎨 Prism.js (Syntax highlighting for code)

---

## 📁 Features

- 🧑‍💻 Developer Profiles w/ bio, tech stack, followers
- 📢 Post code snippets, images, videos & dev thoughts
- 🧵 Threaded comments, likes, and reposts
- 🟢 Realtime feed updates via SupaBase Realtime
- 🔍 Explore trending tags & users
- 🎨 Light / Dark mode with curve-based UI
- 🧼 No drama, no off-topic — just code.

---

## 🧱 Folder Structure

```
/src
 ├── components/      // Reusable UI components
 ├── pages/           // Route-based views
 ├── lib/             // SupaBase client, utils
 ├── styles/          // Custom CSS, themes
 └── data/            // Static or schema-related content
```

---

## ⚙️ Getting Started

```bash
git clone https://github.com/nvmPratyush/onlycodes.git
cd onlycodes

npm install
# or
yarn install
```

Create a `.env.local` and set:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Then run:
```bash
npm run dev
```

---

## 🗃 SupaBase Schema

[See Full Schema ➤](./docs/supabase-schema.sql)

---

## 🧠 Inspiration

- Twitter for Devs
- Clean minimalism like Vercel, Linear, Notion
- Designed to prevent brainrot, nonsense, and off-topic clutter.

---

## 🛡 License

Apache 2.0 License — see `LICENSE` for details.

---

## ✨ Made with ❤️ by @nvmPratyush
*made with [loveable](https://lovable.dev/) by [Pratyush](https://github.com/pratyush0898/)*