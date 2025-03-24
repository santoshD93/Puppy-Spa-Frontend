// 📁 puppy-spa-frontend/pages/index.tsx

import PuppyList from "@/components/PuppyList";

export default function Home() {
  return (
    <main className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">🐶 Puppy Spa Waiting List</h1>
      <PuppyList />
    </main>
  );
}
