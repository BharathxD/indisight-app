import { AlertCircle } from "lucide-react";

type FormErrorProps = {
  message?: string;
};

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;
  return (
    <div className="rounded-md bg-destructive/10 p-3">
      <p className="flex items-center gap-2 text-destructive text-sm">
        <AlertCircle className="size-4" strokeWidth={1.5} />
        {message}
      </p>
    </div>
  );
};
