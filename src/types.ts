export type SectionId =
  | 'home'
  | 'about'
  | 'acknowledgment'
  | 'school-profile'
  | 'philosophy'
  | 'outputs'
  | 'references';

export interface SocialLinks {
  email: string;
  instagram: string;
  facebook: string;
  cv: string;
}

export interface UnitOutput {
  id: number;
  unitNum: string;
  title: string;
  description: string;
  dots: number;
  links: string[];
  linkLabels?: string[];
}

export interface QuizData {
  title: string;
  score: string;
  textRepresentation: string;
  studentName: string;
}

export interface ExamData {
  title: string;
  score: string;
  date: string;
  totalQuestions: number;
  correctAnswers: number;
}
