export function FlexibleColumnWrapper({ children }: { children: React.ReactNode; }) {
  return <nav className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">{children}</nav>;
}
