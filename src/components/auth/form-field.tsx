import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";

type FormFieldProps = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: ReactNode;
  error?: string;
  disabled?: boolean;
  register: UseFormRegisterReturn;
};

export const FormField = ({
  id,
  label,
  type,
  placeholder,
  icon,
  error,
  disabled,
  register,
}: FormFieldProps) => (
  <div className="space-y-2">
    <div className="font-medium text-sm">{label}</div>
    <div className="relative">
      <div className="-translate-y-1/2 absolute top-1/2 left-3 text-muted-foreground">
        {icon}
      </div>
      <Input
        className="pl-10"
        disabled={disabled}
        id={id}
        placeholder={placeholder}
        type={type}
        {...register}
      />
    </div>
    {error && (
      <p className="flex items-center gap-1 text-destructive text-sm">
        <AlertCircle className="size-3" />
        {error}
      </p>
    )}
  </div>
);
