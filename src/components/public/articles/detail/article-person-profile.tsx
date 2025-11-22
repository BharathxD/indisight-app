import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
          <div className="space-y-4" key={person.slug}>
            <div className="flex items-center gap-3">
              <Avatar className="size-10 shrink-0">
                {person.imageUrl && (
                  <AvatarImage
                    alt={person.name}
                    className="object-cover object-top"
                    src={person.imageUrl}
                  />
                )}
                <AvatarFallback>
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 1)}
                </AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="font-medium text-foreground text-sm leading-tight">
                  {person.name}
                </h3>

                {(person.jobTitle || person.company) && (
                  <p className="text-muted-foreground text-sm">
                    {[person.jobTitle, person.company]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>

            {person.description && (
              <p className="text-foreground text-sm leading-relaxed">
                {person.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
