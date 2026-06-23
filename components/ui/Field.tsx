// components/ui/Field.tsx

interface FieldProps {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, optional, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {optional && <span className="ml-1.5 text-xs font-normal text-muted">optional</span>}
      </label>
      {children}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`rounded-sm border border-rule bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-accent ${props.className ?? ""}`}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`rounded-sm border border-rule bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-accent ${props.className ?? ""}`}
    />
  );
}
