import Image from "next/image";

type ArticlePersonProfileProps = {
  people: {
    name: string;
    slug: string;
    tagline: string | null;
    jobTitle: string | null;
    company: string | null;
    description: string | null;
    imageUrl: string | null;
    linkedinUrl: string | null;
  }[];
};

export const ArticlePersonProfile = ({ people }: ArticlePersonProfileProps) => {
  if (!people.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-base text-foreground/70">
        About The Person
      </h3>

      <div className="space-y-6">
        {people.map((person) => (
          <div className="flex items-start gap-3" key={person.slug}>
            {person.imageUrl && (
              <Image
                alt={person.name}
                className="size-10 shrink-0 rounded-full object-cover object-top"
                height={100}
                src={person.imageUrl}
                width={100}
              />
            )}

            <div className="min-w-0 flex-1">
              <h3 className="mb-1 font-medium text-foreground text-sm leading-tight">
                {person.name}
              </h3>

              {(person.jobTitle || person.company) && (
                <p className="mb-4 text-muted-foreground text-sm last:mb-0">
                  {[person.jobTitle, person.company].filter(Boolean).join(", ")}
                </p>
              )}

              {person.description && (
                <p className="text-foreground text-sm leading-relaxed">
                  {person.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
