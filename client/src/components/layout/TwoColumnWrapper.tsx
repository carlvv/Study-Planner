export function TwoColumnWrapper({ children }: { children: React.ReactNode; }) {
  return <nav className="grid grid-cols-2 gap-4 mt-8 w-full">{children}</nav>;
}
