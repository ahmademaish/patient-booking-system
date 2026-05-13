import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Stethoscope } from "lucide-react";
import { Physician } from "@/types";

export function DoctorCard({ physician }: { physician: Physician }) {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-zinc-800/50 bg-zinc-900 p-6 transition-all duration-300 hover:border-zinc-700">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Image
            src={physician.avatarUrl}
            alt={`${physician.name} portrait`}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full border border-zinc-800 object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">{physician.name}</h3>
            <p className="inline-flex items-center gap-1 text-sm text-zinc-400">
              <Stethoscope className="h-4 w-4" />
              {physician.specialty}
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-zinc-300">{physician.bio}</p>
      </div>
      <Link
        href={`/book?physicianId=${physician.id}`}
        className="mt-6 inline-flex h-11 min-h-11 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-100 px-4 text-sm font-semibold text-zinc-900 transition-all duration-300 ease-in-out active:scale-95 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
      >
        Select physician
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </article>
  );
}
