import type { Todo } from "../types";

/**
 * Temporäre Daten bis Anbindung ans Backend erfolgt ist
 */
export const dummyTodos: Todo[] = [
  {
    matrikelnummer: 12345,
    id: 1,
    titel: "React lernen",
    text: "Components, Props, State verstehen",
    aufgaben: [
      { id: 1, titel: "useState verstehen", erledigt: true },
      { id: 2, titel: "useEffect verstehen", erledigt: false },
      { id: 3, titel: "useContext verstehen", erledigt: false },
      { id: 4, titel: "Syntax lernen", erledigt: true },
    ],
  },
  {
    matrikelnummer: 12345,
    id: 1,
    titel: "React lernen",
    text: "Components, Props, State verstehen",
    aufgaben: [
      { id: 1, titel: "useState verstehen", erledigt: true },
      { id: 2, titel: "useEffect verstehen", erledigt: false },
      { id: 3, titel: "useContext verstehen", erledigt: false },
      { id: 4, titel: "Syntax lernen", erledigt: true },
    ],
  },
  {
    matrikelnummer: 12345,
    id: 1,
    titel: "React lernen",
    text: "Components, Props, State verstehen",
    aufgaben: [
      { id: 1, titel: "useState verstehen", erledigt: true },
      { id: 2, titel: "useEffect verstehen", erledigt: false },
      { id: 3, titel: "useContext verstehen", erledigt: false },
      { id: 4, titel: "Syntax lernen", erledigt: true },
    ],
  },
  {
    matrikelnummer: 12345,
    id: 1,
    titel: "React lernen",
    text: "Components, Props, State verstehen",
    aufgaben: [
      { id: 1, titel: "useState verstehen", erledigt: true },
      { id: 2, titel: "useEffect verstehen", erledigt: false },
      { id: 3, titel: "useContext verstehen", erledigt: false },
      { id: 4, titel: "Syntax lernen", erledigt: true },
    ],
  },
  {
    matrikelnummer: 12345,
    id: 1,
    titel: "React lernen",
    text: "Components, Props, State verstehen",
    aufgaben: [
      { id: 1, titel: "useState verstehen", erledigt: true },
      { id: 2, titel: "useEffect verstehen", erledigt: false },
      { id: 3, titel: "useContext verstehen", erledigt: false },
      { id: 4, titel: "Syntax lernen", erledigt: true },
    ],
  },
  {
    matrikelnummer: 12345,
    id: 2,
    titel: "Web-Anwendungen",
    text: "Website bauen",
    aufgaben: [
      { id: 1, titel: "Java-Script lernen", erledigt: false },
      { id: 2, titel: "HTML/CSS verstehen", erledigt: true },
    ],
  },
  {
    matrikelnummer: 67890,
    id: 3,
    titel: "Mathe üben",
    text: "Lineare Algebra",
    aufgaben: [{ id: 1, titel: "Vektoren", erledigt: true }],
  },
];
