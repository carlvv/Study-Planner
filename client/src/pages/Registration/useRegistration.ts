import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Curricula } from "../../types";
import { program_name, program_version } from "../../data/Curricula";

export type FormType = {
  student_id: string;
  name: string;
  start_semester: string;
  password: string;
  password_confirm: string;
};
const PASSWORD_SALT: string = "salt";

export function useRegistration() {
  const navigation = useNavigate();

  const [step, setStep] = useState(0);

  const [curriculaData, setCurriculaData] = useState<Curricula>({
    isBachelor: true,
    program_name: "",
    program_version: "",
  });

  const [data, setData] = useState<FormType>({
    student_id: "",
    name: "",
    start_semester: "",
    password: "",
    password_confirm: "",
  });

  const [error, setError] = useState<FormType>({
    student_id: "",
    name: "",
    start_semester: "",
    password: "",
    password_confirm: "",
  });

  const headlines = [
    "Was studieren Sie?",
    `Welchen ${curriculaData.isBachelor ? "Bachelor" : "Master"} Studiengang?`,
    "Wählen Sie ihre Studienordnung aus.",
    "Bitte füllen Sie das Formular aus.",
  ];

  //TODO
  const names: string[] = program_name;
  const versions: string[] = program_version;

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  function updateCurricula(key: string, value: any) {
    setCurriculaData((prev) => ({
      ...prev,
      [key]: value,
    }));
    nextStep();
  }

  function updateForm(key: string, value: string) {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit() {
    const errors = validateForm(data);
    setError(errors);

    const noErrors = Object.values(errors).every((value) => value === "");

    if (noErrors) {
      navigation("/login");
      sendData(curriculaData, data);
    }
  }
  return {
    step,
    headlines,
    names,
    versions,
    prevStep,
    updateCurricula,
    updateForm,
    data,
    error,
    handleSubmit,
  };
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
  const studentData = {
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
    ]),
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
