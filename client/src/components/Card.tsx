import { H2, SubHeadline } from "./Headlines";

export function Card({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col justify-center p-4 border-2 border-gray-300 rounded-xl gap-2">
      <H2>{title}</H2>
      <SubHeadline>{text}</SubHeadline>
    </div>
  );
}

export function CardWrapper({ children }: { children?: React.ReactElement } ) {
  return (
    <div className="flex flex-col justify-center p-4 pt-8 border-2 border-gray-300 rounded-xl gap-2 relative">
        {children}
    </div>
  );
}
