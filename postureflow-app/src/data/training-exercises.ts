import type { TrainingExercise } from "../types/app";

export const FALLBACK_TRAINING_EXERCISES: TrainingExercise[] = [
  {
    id: "breathwork-chair-reset",
    title: "Reset de Respiracion 4-6",
    duration: "3 min",
    category: "Respiracion",
    videoUrl:
      "https://res.cloudinary.com/demo/video/upload/so_0,du_6,w_720,c_fill/docs/walking_talking.mp4",
    description:
      "Respiracion nasal lenta para soltar mandibula, cuello y hombros antes de volver al foco.",
  },
  {
    id: "thoracic-back-open",
    title: "Apertura Toracica Guiada",
    duration: "4 min",
    category: "Espalda",
    videoUrl:
      "https://res.cloudinary.com/demo/video/upload/so_6,du_6,w_720,c_fill/docs/walking_talking.mp4",
    description:
      "Movilidad suave para deshacer hombros cerrados y recuperar amplitud en la espalda alta.",
  },
  {
    id: "lumbar-desk-flow",
    title: "Descarga Lumbar en Silla",
    duration: "5 min",
    category: "Espalda",
    videoUrl:
      "https://res.cloudinary.com/demo/video/upload/so_0,du_6,w_720,c_fill/dog.mp4",
    description:
      "Secuencia corta de basculacion pelvica y respiracion baja para aliviar tension lumbar.",
  },
  {
    id: "complete-posture-flow",
    title: "Flujo Postural Completo",
    duration: "6 min",
    category: "Flujo Completo",
    videoUrl:
      "https://res.cloudinary.com/demo/video/upload/so_4,du_6,w_720,c_fill/dog.mp4",
    description:
      "Rutina integral para cuello, columna toracica, cadera y respiracion en una pausa activa.",
  },
];
