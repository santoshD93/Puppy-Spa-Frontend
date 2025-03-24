"use client"; 

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function MyApp({ Component, pageProps }: any) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
