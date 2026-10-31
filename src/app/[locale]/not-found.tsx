import { ButtonLink } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/dictionary";
import { Wordmark } from "@/components/ui/wordmark";

export default async function NotFound() {
  const dict = await getDictionary();

  return (
    <div className="grain flex min-h-[70vh] flex-col items-center justify-center bg-ivory px-6 py-28 text-center text-obsidian">
      <Wordmark size="sm" className="text-stone" />
      <p className="display-hero mt-14">{dict.notFound.title}</p>
      <h1 className="display-md mt-6 text-balance text-stone">
        {dict.notFound.body}
      </h1>
      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/collection" tone="obsidian" variant="outline">
          {dict.notFound.collection}
        </ButtonLink>
        <ButtonLink href="/" tone="obsidian" variant="ghost">
          {dict.notFound.home}
        </ButtonLink>
      </div>
    </div>
  );
}
