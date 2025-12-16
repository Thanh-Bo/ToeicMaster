// Định nghĩa cấu trúc JSON nhận về từ API
export interface Answer {
  label: string;
  content: string;
}

export interface Question {
  id: number;
  questionNo: number;
  content: string;
  answers: Answer[];
}

export interface Group {
  id: number;
  textContent: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  questions: Question[];
}

export interface Part {
  id: number;
  name: string;
  groups: Group[];
}

export interface TestDetail {
  id: number;
  title: string;
  parts: Part[];
}