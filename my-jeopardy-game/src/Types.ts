export type questionSchema = {
  questionText: string;
  answer: string;
  value: number;
  status: "Template" | "Unsaved" | "Unfinished" | "Completed";
};

export type categorySchema = {
  name: string;
  status: "Template" | "Unsaved" | "Unfinished" | "Completed";
  questions: [questionSchema, ...questionSchema[]];
};

export type gameStateSchema = {
  gameId: string;
  game: [
    {
      name: string;
      status: "Template" | "Unsaved" | "Unfinished" | "Completed";
      questions: [questionSchema, ...questionSchema[]];
    }
  ];
  status: boolean;
};