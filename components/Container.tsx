export function Container({ children, className = "", schmal = false }: { children: React.ReactNode; className?: string; schmal?: boolean }) {
  return <div className={`mx-auto w-full px-5 sm:px-8 ${schmal ? "max-w-text" : "max-w-inhalt"} ${className}`}>{children}</div>;
}
