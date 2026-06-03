import { UnitOutput, SocialLinks, QuizData, ExamData } from './types';

export const SOCIAL_LINKS: SocialLinks = {
  email: 'https://mail.google.com/mail/u/0/?fs=1&to=preciouslara.degoma@g.msuiit.edu.ph&tf=cm',
  instagram: 'https://www.instagram.com/krazzylara?igsh=MXNsOHo4OThhd3Y3Nw%3D%3D',
  facebook: 'https://www.facebook.com/preciouslaradegomaa',
  cv: 'https://drive.google.com/file/d/1ibQ-GncC1h-QbwQ9F5cJPfv1VmeC86VS/view?usp=sharing'
};

export const COURSE_INFO = {
  title: 'Technology for Teaching and Learning 1 Laboratory',
  code: 'T78',
  instructor: 'Prof. Rizalina G. Gomez',
  student: 'Precious Lara L. Degoma',
  institution: 'Mindanao State University - Iligan Institute of Technology',
  dept: 'College of Education (CED)',
  major: 'BSEd Biology Student'
};

export const UNIT_OUTPUTS: UnitOutput[] = [
  {
    id: 1,
    unitNum: 'Unit 1',
    title: 'Introduction To Technology for Teaching and Learning',
    description: '',
    dots: 1,
    links: ['https://docs.google.com/document/u/2/d/12TJb5S4yjmXQpbFJbkySkrw_jHwtNFrpH3nLXg-KCl8/edit?usp=sharing']
  },
  {
    id: 2,
    unitNum: 'Unit 2',
    title: 'Theories And Principles in the Use and Design of Technology-Driven Lessons',
    description: '',
    dots: 2,
    links: ['https://docs.google.com/document/u/2/d/11wFciZUrgmKj3FwiP5NKqLfyeDLwtIDrJNQm3WOX2Qk/edit?usp=sharing']
  },
  {
    id: 3,
    unitNum: 'Unit 3',
    title: 'ICT and Conventional Learning Materials to Enhance Teaching & Learning',
    description: '',
    dots: 3,
    links: [
      'https://docs.google.com/document/d/18bpeyPSyfFxUh7Qumxvp26hnziRMuE5deW8b3vYrFOo/edit?tab=t.0',
      'https://docs.google.com/document/d/1oDR23h39PTQvo_cxhtEUPFrCkXe3qahmm-6la94cc5c/edit?usp=drive_open&ouid=117034527289032559386',
      'https://youtu.be/BFbMB-m5m44?si=8mj5HoUZ7AAxh15v'
    ],
    linkLabels: [
      'Lesson 1.1 (Animal Kingdom)',
      'Lesson 1.2 (Food Chain)',
      'Lesson 2 (Educational Video Link)'
    ]
  },
  {
    id: 4,
    unitNum: 'Unit 4',
    title: 'Innovative Technologies for Assessment Tasks in Teaching and Learning',
    description: '',
    dots: 4,
    links: ['https://docs.google.com/document/d/1t0mbimx9iPXieHJIHNyK73X3l3ikF9DMciZX7XOUrp0/edit?tab=t.0']
  },
  {
    id: 5,
    unitNum: 'Unit 5',
    title: 'Flexible Learning Environment',
    description: '',
    dots: 5,
    links: ['https://docs.google.com/document/d/1aogshcLI6rFy5FqtJLE2whE03HiH3MBFBRwxSEdb_sw/edit?tab=t.0']
  },
  {
    id: 6,
    unitNum: 'Unit 6',
    title: 'Instructional Design Models',
    description: '',
    dots: 6,
    links: ['https://drive.google.com/file/u/2/d/18LVw6w3DO9HEy3Ovt2g6W0MKAt__P6Ic/view?usp=sharing']
  }
];

export const DIGITAL_PRESENTATION_LINK = 'https://docs.google.com/document/d/1EFHshSVfGs-UMttSeXEfi3pceO_S8m3GHsN1Za_PS0E/edit?tab=t.0';

export const REFERENCES_LINKS = {
  imagesFolder: 'https://docs.google.com/document/d/1tRoL3gpE6MlUJhbu8TUuB3caekrUjiyng8075um9m_Y/edit?tab=t',
  citationsFolder: 'https://docs.google.com/document/d/1HaEp_GAqjHUWdlRLe2sFtoT2Hd4Vpw66kJOVD0-NJj8/edit?tab=t.0'
};

export const QUIZZES_DATA: QuizData[] = [
  {
    title: 'Quiz #1',
    score: '5/7',
    textRepresentation: 'Precious Lara L. Degoma - BSEd Biology - 5/7 Correct',
    studentName: 'Precious Lara L. Degoma'
  },
  {
    title: 'Quiz #2',
    score: '24/30',
    textRepresentation: 'Precious Lara L. Degoma - 24 Score - Class Lab Grade 12',
    studentName: 'Precious Lara L. Degoma'
  }
];

export const EXAMS_DATA: ExamData[] = [
  {
    title: '1st Examination (Midterm)',
    score: '75/100',
    date: 'April 8, 2026',
    totalQuestions: 100,
    correctAnswers: 75
  },
  {
    title: '2nd Examination (Final)',
    score: '93/100',
    date: 'May 24, 2026',
    totalQuestions: 100,
    correctAnswers: 93
  }
];

export const SCHOOL_PROFILE = {
  about: `Mindanao State University – Iligan Institute of Technology is defined by a specific brand of academic resilience. While many institutions focus on prestige, the Institute prioritizes the grit required to master complex fields. It is a space where tradition meets technology, cultivating graduates who are as grounded in their Mindanaoan roots as they are prepared for the global stage. It remains a cornerstone of the region, driven by the belief that true excellence is earned, not given.`,
  college: `The CED is the dedicated training ground for those answering the call of the "Noble Profession." As a Center of Excellence, the college goes beyond technical training, focusing on the heart of teaching to nurture every learner's potential. By blending innovative pedagogical skills with a deep sense of social responsibility, the CED empowers its students to become catalysts for change. A student of this college is more than an educator; they are a visionary committed to the sustainable development of Mindanao, ensuring that quality education reaches every corner of the country.`,
  vmgo: {
    vision: "A research university committed to the holistic development of the individual and society.",
    mission: "To provide quality education for the sustainable development of the nation and the global community.",
    coreValues: "Honor, Excellence, Service, Compassion, Resilience, and Innovation",
    philosophy: "MSU-IIT's inclusive and transformative education, grounded in its multicultural context, empowers students to become innovators, peacebuilders, and changemakers."
  },
  milestones: [
    { title: 'PH Top 5', description: 'Ranked among the most sustainable Higher Education Institutions in the Philippines.' },
    { title: 'QS Asia Rankings', description: 'Placed within the top 50% of Asian universities.' },
    { title: 'Center of Excellence', description: 'Recognized by CHED for its outstanding teacher education programs.' },
    { title: 'Mission-Aligned', description: 'Dedicated to producing 21st-century educators who are tech-savvy and value-laden.' },
    { title: 'Research & Tech Culture', description: 'Home to Fab Lab Mindanao and the Premier Research Institute of Science and Mathematics (PRISM), fostering a culture of scientific inquiry and digital innovation.' },
    { 
      title: 'LEPT Board Performance', 
      description: 'Recorded a stellarly high 94.20% rating at the secondary level in the March 2026 Licensure Examination for Professional Teachers (LEPT). The Institute produced 112 licensed educators, achieving passing rates of 86.67% in the secondary level and 66.67% in the elementary level.',
      link: 'https://www.instagram.com/p/DYPNEDrz94d/'
    }
  ]
};

export const PHILOSOPHY_PILLARS = [
  {
    num: 1,
    title: 'Student-Led Discovery',
    text: 'I believe in active learning where the teacher serves as a guide. Students learn best when they are at the center of the process—collaborating, creating, and exploring.'
  },
  {
    num: 2,
    title: 'Technology & Inquiry',
    text: 'By integrating digital tools and hands-on projects, I aim to bridge complex scientific concepts with real-world experiences, fostering deep curiosity and engagement.'
  },
  {
    num: 3,
    title: 'The \'Brave Space\'',
    text: 'I am dedicated to a classroom where mistakes are celebrated as essential steps in growth. My goal is to cultivate a mindset where every student feels empowered to take risks and learn.'
  }
];

export const ACKNOWLEDGMENTS = {
  mentor: {
    name: "Prof. Rizalina G. Gomez",
    role: "To my Mentor",
    text: "My sincere gratitude to Prof. Rizalina G. Gomez for her expert guidance and for providing the technical foundation necessary to navigate the 21st-century education."
  },
  family: {
    name: "my parents",
    role: "To my Family",
    text: "Thank you to my parents for teaching me the value of hard work through our family businesses; those lessons are the backbone of my professional character."
  },
  community: {
    name: "MSU-IIT and the Almighty",
    role: "To my Community",
    text: "To my peers at MSU-IIT and to the Almighty, thank you for the strength, wisdom, and collaboration. This work is a tribute to the collective effort of all who believe in my potential as a future educator."
  }
};

export const REFLECTION_TEXT = `My journey through this course has been a powerful evolution from theory to practice. While Units 1 and 2 allowed me to personally explore the core concepts of technology, it was the collaborative spirit of Units 3 through 6 that truly shaped my perspective.

Creating multimedia tools and professional teaching materials for Biology wasn't just about the technology; it was about the synergy of working with my teammates. We challenged each other to think like professional educators, developing assessments and lesson plans that we couldn't have created alone. This teamwork pushed me to grow in ways I didn't expect, showing me that the best science lessons come from a blend of diverse ideas. I carry these lessons forward with a deep sense of gratitude, ready to use these modern tools to nurture the potential of my future students.`;
