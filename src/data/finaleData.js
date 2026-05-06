const generateQuestions = () => {
  const baseQuestions = [
    { text: "Which of the following is the most abundant gas in the Earth's atmosphere?", options: ['A: Oxygen', 'B: Nitrogen', 'C: Carbon Dioxide', 'D: Argon'], correctOption: 'B' },
    { text: "Who developed the theory of general relativity?", options: ['A: Isaac Newton', 'B: Nikola Tesla', 'C: Albert Einstein', 'D: Galileo Galilei'], correctOption: 'C' },
    { text: "What is the capital of Australia?", options: ['A: Sydney', 'B: Melbourne', 'C: Canberra', 'D: Perth'], correctOption: 'C' },
    { text: "Which element is a liquid at room temperature?", options: ['A: Mercury', 'B: Lead', 'C: Iron', 'D: Gold'], correctOption: 'A' },
    { text: "In computer science, what does GUI stand for?", options: ['A: General User Interface', 'B: Graphical User Interface', 'C: Global User Integration', 'D: Graphical Utility Interface'], correctOption: 'B' }
  ];

  const questions = [];
  for (let i = 1; i <= 20; i++) {
    const base = baseQuestions[(i - 1) % 5];
    questions.push({
      id: `q${i}`,
      round: Math.ceil(i / 5),
      text: i <= 5 ? base.text : `Sample Question ${i}: ${base.text.split('?')[0]} variation?`,
      options: base.options,
      correctOption: base.correctOption,
      points: 10 + (Math.ceil(i / 5) - 1) * 10 // Round 1: 10, Round 2: 20, Round 3: 30, Round 4: 40
    });
  }
  return questions;
};

const generateResponses = (questions, students) => {
  const responses = [];
  const options = ['A', 'B', 'C', 'D'];
  
  questions.forEach(q => {
    students.forEach(s => {
      // 70% chance to get it right
      const isCorrect = Math.random() > 0.3;
      const chosenOption = isCorrect ? q.correctOption : options.find(o => o !== q.correctOption);
      
      responses.push({
        studentId: s.id,
        questionId: q.id,
        chosenOption: chosenOption,
        // Random time between 2s and 15s
        timeMs: Math.floor(Math.random() * 13000) + 2000
      });
    });
  });
  return responses;
};

const generateStudents = (count) => {
  const colors = [
    '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
    '#6366f1', '#84cc16', '#06b6d4', '#eab308', '#d946ef', '#10b981', '#3b82f6', '#f43f5e'
  ];
  const schools = ['XYZ High', 'ABC Public', 'LMN Academy', 'PQR Global', 'City School', 'Valley High'];

  const students = [];
  for (let i = 1; i <= count; i++) {
    students.push({
      id: `s${i}`,
      name: `Student ${i}`,
      school: schools[i % schools.length],
      color: colors[i % colors.length]
    });
  }
  return students;
};

export const generateMockData = (studentCount = 20) => {
  const students = generateStudents(studentCount);
  const questions = generateQuestions();
  const responses = generateResponses(questions, students);

  return {
    students,
    questions,
    responses
  };
};

export const finaleData = generateMockData(20);
