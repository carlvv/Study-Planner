export function FlexibleColumnWrapper({ children }: { children: React.ReactNode; }) {
  return <nav className="flex flex-wrap gap-4 mt-8 w-full">{children}</nav>;
}
