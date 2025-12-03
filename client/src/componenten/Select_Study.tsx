const study = [
  "Angewandte Wirtschaftspsychologie & Data Analytics",
  "Betriebswirtschaftslehre",
  "Informatik",
];

export function Select_Study() {
  return study.map((s,i) => <Button_Primary text={(i+1)+ " " + s} />);
}

export function Button_Primary({ text }: { text: string }) {
  return <button className="p-4 font-bold bg-green-600">{text}</button>;
}
