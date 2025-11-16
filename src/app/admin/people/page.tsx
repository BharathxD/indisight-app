"use client";

import { Plus, Users } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense, useState } from "react";
import { PeopleError } from "@/components/admin/people/people-error";
import { PeopleLoading } from "@/components/admin/people/people-loading";
import { PeopleTable } from "@/components/admin/people/people-table";
import { PersonDialog } from "@/components/admin/people/person-dialog";
import { DashboardContainer } from "@/components/dashboard-container";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";

type Person = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  jobTitle: string | null;
  company: string | null;
  description: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  linkedinUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const PeoplePageContent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [search] = useQueryState("search", parseAsString.withDefault(""));

  const { data, isLoading, error, refetch } = trpc.cms.person.list.useQuery({
    limit: 50,
    search: search || undefined,
  });

  const handleEdit = (person: Person) => {
    setSelectedPerson(person);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedPerson(null);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedPerson(null);
    }
  };

  return (
    <DashboardContainer
      description="Manage people featured in articles"
      icon={Users}
      title="People"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">All People</h2>
            <p className="text-muted-foreground text-sm">
              {data
                ? `${data.people.length} ${data.people.length !== 1 ? "people" : "person"}`
                : "Loading..."}
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus />
            Create Person
          </Button>
        </div>

        {isLoading && <PeopleLoading />}

        {error && (
          <PeopleError
            error={new Error(error.message)}
            onRetry={() => refetch()}
          />
        )}

        {data && !isLoading && !error && (
          <PeopleTable onEdit={handleEdit} pageCount={1} people={data.people} />
        )}

        <PersonDialog
          onOpenChange={handleDialogClose}
          open={dialogOpen}
          person={selectedPerson}
        />
      </div>
    </DashboardContainer>
  );
};

const PeoplePage = () => (
  <Suspense fallback={<PeopleLoading />}>
    <PeoplePageContent />
  </Suspense>
);

export default PeoplePage;
