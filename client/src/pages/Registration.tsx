import { useState } from "react";
import { type Student, type Curricula } from "../types";
import { ButtonPrimary, IconButton, IconLink } from "../components/Buttons";
import { program_version, program_name } from "../data/Curricula";
import { ArrowLeft } from "lucide-react";

//TODO: richtiges salt holen
const PASSWORD_SALT: string = "salt";

type FormType = {
  student_id: string;
  name: string;
  start_semester: string;
  password: string;
  password_confirm: string;
};

export default function Registration() {
  //Speichert auf welcher Seite sich der User befindet
  const [step, setStep] = useState(1);

  const [curriculaData, setCurriculaData] = useState<Curricula>({
    isBachelor: true,
    program_name: "",
    program_version: "",
  });

  //Speichert die Eingaben vom Formular
  const [formData, setFormData] = useState<FormType>({
    student_id: "",
    name: "",
    start_semester: "",
    password: "",
    password_confirm: "",
  });

  //Zum setzen der Fehlermeldung für jedes Eingabefeld
  const [formErrors, setFormErrors] = useState<FormType>({
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
      {/* "Zurück-Pfeil"*/}
      {step === 1 && <IconLink to={"/"} Icon={ArrowLeft}></IconLink>}
      {step > 1 && (
        <IconButton Icon={ArrowLeft} onClick={() => prevStep()}></IconButton>
      )}
      {/* Erste Seite - Studienrichtung*/}
      {step === 1 && (
        <div>
          <label>Was studieren Sie?</label>
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

      {/* Zweite Seite - Studiengang*/}
      {step === 2 && (
        <div>
          <label>
            Welchen {curriculaData.isBachelor ? "Bachelor" : "Master"}{" "}
            Studiengang?
          </label>
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

      {/* Dritte Seite - Studienordnung*/}
      {step === 3 && (
        <div>
          <label>Wählen Sie ihre Studienordnung aus</label>
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

      {/* Vierte Seite - Formular für Benutzerdaten*/}
      {step === 4 && (
        <div>
          <h1>Bitte füllen Sie das Formular aus.</h1>
          <label>Dein vollständiger Name:</label>
          {formErrors.name !== "" && <p className="error">{formErrors.name}</p>}
          <input
            type="text"
            name="name"
            placeholder="Max Mustermann"
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
          />
          <label>Deine Matrikelnummer:</label>
          {formErrors.student_id !== "" && (
            <p className="error">{formErrors.student_id}</p>
          )}
          <input
            type="text"
            name="student_id"
            placeholder="106123"
            onChange={(e) => {
              setFormData({ ...formData, student_id: e.target.value });
            }}
          />
          <label>Dein Start-Semester:</label>
          {formErrors.start_semester !== "" && (
            <p className="error">{formErrors.start_semester}</p>
          )}
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
          <label>Dein Passwort:</label>
          {formErrors.password !== "" && (
            <p className="error">{formErrors.password}</p>
          )}
          <input
            type="password"
            name="password"
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
          />
          <label>Passwort bestätigen:</label>
          {formErrors.password_confirm !== "" && (
            <p className="error">{formErrors.password_confirm}</p>
          )}
          <input
            type="password"
            name="password_confirm"
            onChange={(e) => {
              setFormData({ ...formData, password_confirm: e.target.value });
            }}
          />
          <ButtonPrimary
            to={"/"}
            onClick={() => {
              const formErrors: FormType = validateForm(formData);
              setFormErrors(formErrors);
              //keine Fehler?
              const noErrors = Object.values(formErrors).every(
                (value) => value === ""
              );
              if (noErrors) {
                sendData(curriculaData, formData);
              }
            }}
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

/**
 * Validiert die Benutzereingaben im Formular und gibt ein Objekt zurück, dass die Fehlermeldungen für jedes Eingabefeld enthält.
 *
 * @param formData Daten des Formulars
 * @returns Objekt, dass die Fehlermeldungen für jedes Eingabefeld enthält
 */
function validateForm(formData: FormType): FormType {
  //Alle Felder ausgefüllt?
  const formErrors: FormType = Object.fromEntries(
    (Object.keys(formData) as Array<keyof FormType>).map((key) => [
      key,
      formData[key] === "" ? "Fülle das Feld aus" : "",
    ])
  ) as FormType;
  //Start_Semester darf leer sein da optional
  formErrors.start_semester = "";

  //Matrikelnummer gültig?
  const num = Number(formData.student_id);

  if (isNaN(num) || formData.student_id.length > 6) {
    formErrors.student_id = "Ungültige Matrikelnummer";
  }

  //TODO: Start-Semester Validierung

  //Passwort zu kurz?
  if (formData.password.length < 8) {
    formErrors.password = "Passwort zu kurz";
  }

  //Passwort-Bestätigung richtig?
  if (formData.password !== formData.password_confirm) {
    formErrors.password_confirm = "Die Passwort-Bestätigung ist nicht korrekt";
  }

  return formErrors;
}
