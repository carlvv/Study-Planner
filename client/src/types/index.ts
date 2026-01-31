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

export type Curricula = {
  program_name: string;
  program_version: string;
  isBachelor: boolean;
};

export type Student = {
  identity: string;
  name: string;
  study_id: string;
  start_semester: string;
};
