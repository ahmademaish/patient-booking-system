# NovaCare Patient Booking System

Production-grade Next.js booking experience designed for assessment submission quality, with strict validation, resilient UI behavior, and an operations-friendly admin workflow.

## How to run the project

1. Install dependencies:

```bash
npm install
```

2. Start the local development server:

```bash
npm run dev
```

3. Open:
   - Patient Portal: [http://localhost:3000](http://localhost:3000)
   - Admin Command Center: [http://localhost:3000/admin](http://localhost:3000/admin)

## What you built

NovaCare delivers a polished **Patient Booking Portal** where users can choose a physician, select an available slot, and submit validated booking details.  
It also includes a secure and efficient **Admin Command Center** for appointment review, status management, and guarded deletion workflows through a focused details modal.

## Key technical/product decisions

- **React Context for hydration-safe mock global state**
  - Centralized booking/slot state lives in `BookingContext`, exposed through `useBookings`.
  - Hydration is explicitly gated so data-driven UI renders consistently between server and client.

- **Zod for strict client-side form validation and security**
  - Booking inputs are validated with schema rules for required fields, proper email format, and max lengths.
  - Sanitization and validation errors are surfaced inline to block invalid submissions early.

- **Command Center Details Modal**
  - The admin table stays clean and scannable.
  - Full appointment details and actions are intentionally moved into the modal, improving clarity and reducing visual overload.

- **Two-Step Delete button**
  - First click arms deletion and visually shifts to destructive intent.
  - Second click confirms deletion, removes the booking, closes the modal, and triggers a success toast.

- **`suppressHydrationWarning` to handle browser extensions**
  - `suppressHydrationWarning` was added to the root `<body>` in `app/layout.tsx` to gracefully ignore non-app attributes injected by browser extensions (e.g., Grammarly), preventing false-positive hydration mismatch noise.

## What you would improve with more time

If given more time, I would implement a comprehensive patient authentication system (e.g., NextAuth) backed by a PostgreSQL database (using Prisma/Drizzle). This would allow patients to log into a secure portal, view their historical appointment records, track ongoing treatments, and securely access past medical reports and lab results.
