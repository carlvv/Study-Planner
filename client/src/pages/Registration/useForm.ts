import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { Curricula } from "../../types";
import { fetch_backend } from "../../utils/helper";

export type FormType = {
  student_id: string;
  name: string;
  start_semester: string;
  password: string;
  password_confirm: string;
};

function validateForm(formData: FormType): FormType {
  const errors: FormType = {
    student_id: "",
    name: "",
    start_semester: "",
    password: "",
    password_confirm: "",
  };

  (
    ["student_id", "name", "password", "password_confirm"] as Array<
      keyof FormType
    >
  ).forEach((key) => {
    if (!formData[key]) errors[key] = "Fülle das Feld aus";
  });

  // Start-Semester Pflichtfeld prüfen
  if (!formData.start_semester) {
    errors.start_semester = "Fülle das Feld aus";
  } else {
    const semesterRegex = /^(WS|SS)\d{2}$/;

    if (!semesterRegex.test(formData.start_semester)) {
      errors.start_semester =
        "Ungültiges Format. Beispiel: WS25 oder SS23";
    }
  }

  const studentNumber = Number(formData.student_id);
  if (
    formData.student_id &&
    (isNaN(studentNumber) || formData.student_id.length > 6)
  ) {
    errors.student_id = "Ungültige Matrikelnummer";
  }

  if (formData.password && formData.password.length < 8) {
    errors.password = "Passwort zu kurz";
  }

  if (formData.password !== formData.password_confirm) {
    errors.password_confirm = "Die Passwort-Bestätigung ist nicht korrekt";
  }

  return errors;
}

export const useForm = (curriculaData: Curricula) => {
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

  const navigate = useNavigate();

  const updateForm = <K extends keyof FormType>(key: K, value: FormType[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Mutation definieren
  const mutation = useMutation({
    mutationFn: async (formData: FormType) => {
      const response = await fetch_backend("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: formData.student_id,
          name: formData.name,
          password: formData.password,
          study_id: curriculaData.program_version,
          start_semester: formData.start_semester,
        }),
      });
      const res = response.json();
      if (!response.ok) {
        // Print Server Message
        throw new Error((await res).msg);
      }

      return res;
    },
    onSuccess: () => {
      navigate("/login");
    },
  });

  const handleSubmit = () => {
    const errors = validateForm(data);
    setError(errors);

    const hasErrors = Object.values(errors).some((v) => v !== "");
    if (!hasErrors) {
      mutation.mutate(data);
    }
  };

  return {
    data,
    error,
    updateForm,
    handleSubmit,
    isLoading: mutation.isPending,
    mutationError: mutation.error,
  };
};
