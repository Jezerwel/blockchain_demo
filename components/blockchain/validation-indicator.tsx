"use client";

interface ValidationIndicatorProps {
  readonly isValid: boolean;
  readonly invalidAtIndex: number | null;
  readonly isValidating: boolean;
  readonly checkedCount: number;
}

export function ValidationIndicator(props: ValidationIndicatorProps) {
  const statusClassName: string = props.isValid
    ? "border-emerald-400/70 text-emerald-300 shadow-emerald-500/20"
    : "border-red-400/70 text-red-300 shadow-red-500/20";
  const label: string = props.isValid ? "Chain Valid" : "Chain Invalid";
  return (
    <section
      aria-live="polite"
      className={`rounded-xl border p-4 text-center shadow-lg ${statusClassName}`}
    >
      <h2
        className={`font-pixel text-sm uppercase tracking-[0.25em] ${props.isValidating ? "validation-pulse" : ""}`}
      >
        {label}
      </h2>
      <p className="mt-2 text-xs text-zinc-200">
        {props.isValidating ? `Validating... checked ${props.checkedCount} blocks` : "Idle"}
      </p>
      {!props.isValid && props.invalidAtIndex !== null ? (
        <p className="mt-1 text-xs text-red-200">First invalid block: #{props.invalidAtIndex}</p>
      ) : null}
    </section>
  );
}
