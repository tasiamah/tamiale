import { ButtonLink } from "@/components/ui/button";
import { Wordmark } from "@/components/ui/wordmark";

export default function NotFound() {
  return (
    <div className="grain flex min-h-[70vh] flex-col items-center justify-center bg-ivory px-6 py-28 text-center text-obsidian">
      <Wordmark size="sm" className="text-stone" />
      <p className="display-hero mt-14">404</p>
      <h1 className="display-md mt-6 text-balance text-stone">
        This page is not part of the house.
      </h1>
      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/collection" tone="obsidian" variant="outline">
          The collection
        </ButtonLink>
        <ButtonLink href="/" tone="obsidian" variant="ghost">
          Return home
        </ButtonLink>
      </div>
    </div>
  );
}
