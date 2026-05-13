"use client";

import { ReactNode } from "react";
import { BookingProvider } from "@/context/BookingContext";

export function Providers({ children }: { children: ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>;
}
