import TextInput from "../../components/Input";
import { ButtonPrimary } from "../../components/Buttons";
import type { Curricula } from "../../types";
import { useForm } from "./useForm";
import { Loader } from "../../components/Loader";

export function UserForm({ curriculaData }: { curriculaData: Curricula }) {
  const { handleSubmit, updateForm, error, data, mutationError, isLoading } =
    useForm(curriculaData);

  return (
    <div className="flex flex-col gap-3 w-full">
      <TextInput
        label="Dein vollständiger Name"
        value={data.name}
        error={error.name}
        placeholder="Max Mustermann"
        onChange={(e) => updateForm("name", e)}
      />
      <TextInput
        label="Dein Start-Semester:"
        value={data.start_semester}
        error={error.start_semester}
        placeholder="WS25"
        name="semester"
        onChange={(e) => updateForm("start_semester", e)}
      />
      <TextInput
        label="Deine Matrikelnummer"
        value={data.student_id}
        error={error.student_id}
        placeholder="10000"
        name="username"
        onChange={(e) => updateForm("student_id", e)}
      />
      <TextInput
        label="Dein Passwort"
        value={data.password}
        error={error.password}
        placeholder="******"
        type="password"
        onChange={(e) => updateForm("password", e)}
      />
      <TextInput
        label="Dein Passwort bestätigen"
        value={data.password_confirm}
        error={error.password_confirm}
        placeholder="******"
        type="password"
        onChange={(e) => updateForm("password_confirm", e)}
      />

      <div className="flex justify-center items-center">
        {isLoading && <Loader />}
        {mutationError && (
          <p className="text-red-500">{mutationError.message}</p>
        )}
      </div>

      <ButtonPrimary onClick={handleSubmit} disable={isLoading}>
        Absenden
      </ButtonPrimary>
    </div>
  );
}
