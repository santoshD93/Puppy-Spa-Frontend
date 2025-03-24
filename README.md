# 🐶 Puppy Spa Frontend

This is the frontend for the Puppy Spa Waiting List application — a simple yet powerful UI that allows a receptionist to manage daily waiting lists, record puppies, track service status, and search historical data.

## 🔧 Tech Stack

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Query (@tanstack/react-query)](https://tanstack.com/query)
- [React DnD](https://react-dnd.github.io/react-dnd/about)
- [Framer Motion](https://www.framer.com/motion/) (soon)

## 🖥️ Getting Started (Local Dev)

```bash
git clone https://gitlab.com/your-username/puppy-spa-frontend.git
cd puppy-spa-frontend
npm install
npm run dev

Frontend runs at: http://localhost:3000

Make sure the backend is running on http://localhost:4000 for full functionality.

## Project Structure

components/
  - PuppyCard.tsx
  - PuppyList.tsx
  - Loader.tsx
  - AddPuppyForm.tsx

utils/
  - api.ts
  - cn.ts

app/
  - page.tsx (or index.tsx depending on routing)

