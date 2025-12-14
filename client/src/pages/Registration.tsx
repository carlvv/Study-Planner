import { useState } from "react";
import { type Student, type Curricula } from "../types";
import { ButtonPrimary, IconButton, IconLink } from "../componenten/Buttons";
import { program_version, program_name } from "../data/Curricula";
import { ArrowLeft } from "lucide-react";
//import type { Student } from "../types";

const PASSWORD_SALT: string = "salt";

type FormType = {
  student_id: string;
  name: string;
  start_semester: string;
  password: string;
  password_confirm: string;
};

export default function Registration() {
  const [step, setStep] = useState(1);
  const [curriculaData, setCurriculaData] = useState<Curricula>({
    isBachelor: true,
    program_name: "",
    program_version: "",
  });
  const [formData, setFormData] = useState<FormType>({
    student_id: "",
    name: "",
    start_semester: "",
    password: "",
    password_confirm: "",
  });

  //TODO: echte Daten von Backend holen
  const localProgram_name: string[] = program_name;
  const localProgram_version: string[] = program_version;

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  //TODO: CSS
  return (
    <div>
      {step === 1 && <IconLink to={"/"} Icon={ArrowLeft}></IconLink>}
      {step > 1 && (
        <IconButton Icon={ArrowLeft} onClick={() => prevStep()}></IconButton>
      )}

      {step === 1 && (
        <div>
          <h1>Was studieren Sie?</h1>
          <ButtonPrimary
            onClick={() => {
              setCurriculaData({ ...curriculaData, isBachelor: true });
              nextStep();
            }}
          >
            Bachelor
          </ButtonPrimary>
          <p>oder</p>
          <ButtonPrimary
            onClick={() => {
              setCurriculaData({ ...curriculaData, isBachelor: false });
              nextStep();
            }}
          >
            Master
          </ButtonPrimary>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1>
            Welchen {curriculaData.isBachelor ? "Bachelor" : "Master"}{" "}
            Studiengang?
          </h1>
          {localProgram_name.map((name, index) => (
            <ButtonPrimary
              key={index}
              onClick={() => {
                setCurriculaData({ ...curriculaData, program_name: name });
                nextStep();
              }}
            >
              {name}
            </ButtonPrimary>
          ))}
        </div>
      )}

      {step === 3 && (
        <div>
          <h1>Wählen Sie ihre Studienordnung aus</h1>
          {localProgram_version.map((version, index) => (
            <ButtonPrimary
              key={index}
              onClick={() => {
                setCurriculaData({
                  ...curriculaData,
                  program_version: version,
                });
                nextStep();
              }}
            >
              {version}
            </ButtonPrimary>
          ))}
        </div>
      )}

      {step === 4 && (
        <div>
          <h1>Bitte füllen Sie das Formular aus.</h1>
          <h2>Dein vollständiger Name:</h2>
          <input
            type="text"
            name="name"
            placeholder="Max Mustermann"
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
          />
          <h2>Deine Matrikelnummer:</h2>
          <input
            type="text"
            name="student_id"
            placeholder="106123"
            onChange={(e) => {
              setFormData({ ...formData, student_id: e.target.value });
            }}
          />
          <h2>Dein Start-Semester:</h2>
          <input
            type="text"
            name="start_semester"
            placeholder="WS25"
            onChange={(e) => {
              setFormData({
                ...formData,
                start_semester: e.target.value,
              });
            }}
          />
          <h2>Dein Passwort:</h2>
          <input
            type="password"
            name="password"
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
          />
          <h2>Passwort bestätigen:</h2>
          <input
            type="password"
            name="password_confirm"
            onChange={(e) => {
              setFormData({ ...formData, password_confirm: e.target.value });
            }}
          />
          <ButtonPrimary
            to={"/"}
            onClick={() => sendData(curriculaData, formData)}
          >
            Absenden
          </ButtonPrimary>
        </div>
      )}
    </div>
  );
}

//TODO: implementieren
/**
 * Erstellt das Kürzel zu Studiengang und -ordung.
 *
 * @param data Daten für das Kürzel
 * @returns Kürzel zu Studiengang und -ordnung
 */
function getStudyId(data: Curricula): string {
  return data.program_name;
}

//TODO: implementieren
/**
 * Berechnet den Hash-Wert zum Passwort mit dem Salt
 *
 * @param salt Salt-Wert
 * @param password Passwort
 * @returns Hash-Wert zum Passwort
 */
function calcPasswordHash(password: string, salt: string): string {
  return password + salt;
}

/**
 * Sammelt die erfassten Daten und sendet Sie ans Backend
 *
 * @param curriculaData Daten über den Studiengang
 * @param formData Daten über den Studenten
 */
function sendData(curriculaData: Curricula, formData: FormType): void {
  //Nicht alles ausgefüllt?
  const { start_semester, ...requiredFields } = formData;
  const allFilled = Object.values(requiredFields).every((v) => v.trim() !== "");

  if (!allFilled) {
    alert("Bitte füll alle Pflichtfelder aus");
    return;
  }

  //Matrikelnummer gültig?
  const num = Number(formData.student_id);

  if (isNaN(num) || formData.student_id.length > 6) {
    alert("Ungültige Matrikelnummer");
    return;
  }

  //TODO: Start-Semester Validierung
  //löschen wenn start_semester benutzt wurde
  if (start_semester === start_semester) {
    console.log();
  }

  if (formData.password.length < 8) {
    //Passwort zu kurz?
    alert("Passwort zu kurz");
    return;
  }

  //Passwort-Bestätigung richtig?
  if (formData.password !== formData.password_confirm) {
    alert("Die Passwort-Bestätigung war nicht korrekt");
    return;
  }

  const studentData: Student = {
    student_id: formData.student_id,
    name: formData.name,
    pw_hash: calcPasswordHash(formData.password, PASSWORD_SALT),
    salt: PASSWORD_SALT,
    study_id: getStudyId(curriculaData),
    start_semester: formData.start_semester,
  };

  //TODO: Daten speichern
  console.log(studentData);
}
