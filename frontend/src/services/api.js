const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const api = {
  health: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return response.json();
    } catch (error) {
      return { success: false, error: { message: 'Network error' } };
    }
  },

  getModules: async (limit = 20, offset = 0) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/modules?limit=${limit}&offset=${offset}`);
      return response.json();
    } catch (error) {
      return { success: false, error: { message: 'Network error' } };
    }
  },

  getModule: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/modules/${id}`);
      return response.json();
    } catch (error) {
      return { success: false, error: { message: 'Network error' } };
    }
  },

  getQuizQuestions: async (moduleId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quizzes/${moduleId}`);
      return response.json();
    } catch (error) {
      return { success: false, error: { message: 'Network error' } };
    }
  },

  submitQuiz: async (moduleId, answers) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module_id: moduleId, answers })
      });
      return response.json();
    } catch (error) {
      return { success: false, error: { message: 'Network error' } };
    }
  },

  getScenarios: async (moduleId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scenarios/${moduleId}`);
      return response.json();
    } catch (error) {
      return { success: false, error: { message: 'Network error' } };
    }
  },

  evaluateScenario: async (scenarioId, answer) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scenarios/${scenarioId}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer })
      });
      return response.json();
    } catch (error) {
      return { success: false, error: { message: 'Network error' } };
    }
  },

  sendChatMessage: async (message, module = 'general', history = []) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, module, history })
      });
      return response.json();
    } catch (error) {
      return { success: false, error: { message: 'Network error' } };
    }
  },

  createCertificate: async (name, score) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/certificate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score })
      });
      return response.json();
    } catch (error) {
      return { success: false, error: { message: 'Network error' } };
    }
  },

  verifyCertificate: async (certificateId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/certificate/${certificateId}`);
      return response.json();
    } catch (error) {
      return { success: false, error: { message: 'Network error' } };
    }
  },

  generateQuiz: async (topic, difficulty, questionCount) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, question_count: questionCount })
      });
      return response.json();
    } catch (error) {
      return { success: false, error: { message: 'Network error' } };
    }
  }
};
