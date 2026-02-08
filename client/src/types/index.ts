export type Todo = {
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


export type Time = {
  module_id: string
  duration_in_min: number
  date: Date
  owner_id: string
}
export interface Module {
    module_id: string;
    ects: number;
    finished: boolean;
    module_name: string;
    courses: Course[];
}

export interface Course {
    course_id: string;
    ects: number;
    finished: boolean;
    course_name: string;
    grade: number;
}
