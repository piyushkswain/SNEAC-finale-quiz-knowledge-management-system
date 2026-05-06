import React, { createContext, useState, useContext, useEffect } from 'react';
import { finaleData as mockFinaleData } from '../data/finaleData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('sneac_finale_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved data");
      }
    }
    return mockFinaleData;
  });

  // Persist to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('sneac_finale_data', JSON.stringify(data));
  }, [data]);

  const addResponse = (studentId, questionId, chosenOption, timeMs) => {
    setData(prev => {
      // Remove existing response for this student/question if any
      const filteredResponses = prev.responses.filter(
        r => !(r.studentId === studentId && r.questionId === questionId)
      );
      return {
        ...prev,
        responses: [
          ...filteredResponses,
          { studentId, questionId, chosenOption, timeMs }
        ]
      };
    });
  };

  const updateAllData = (newData) => {
    setData(newData);
  };

  const clearDataAndUseMock = () => {
    setData(mockFinaleData);
  };

  return (
    <DataContext.Provider value={{ data, addResponse, updateAllData, clearDataAndUseMock }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
