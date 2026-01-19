import { H3, SubHeadline } from "../Text";

export function Card({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col justify-center px-4 p-2 sm:p-4 border-2 border-gray-300 rounded-xl md:gap-2">
      <H3>{title}</H3>
      <SubHeadline>{text}</SubHeadline>
    </div>
  );
}

export function CardWrapper({ children }: { children?: React.ReactNode } ) {
  return (
    <div className="flex flex-col justify-center px-4 p-4 pt-4 border-2 border-gray-300 rounded-xl gap-2 relative">
        {children}
    </div>
  );
}
