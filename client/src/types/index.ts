export type Todo = {
  matrikelnummer: number;
  id: number;
  titel: string;
  text: string;
  aufgaben: Task[];
};

export type Task = {
  id: number;
  titel: string;
  erledigt: boolean;
};
