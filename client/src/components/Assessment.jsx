import React, { useState, useRef, useEffect } from 'react';
import '../styles/Assessment.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './shared/Navbar';

function Assessment() {
  const [step, setStep] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [anomalies, setAnomalies] = useState([]);
  const webcamRef = useRef(null);
  const streamRef = useRef(null);
  const faceDetectorRef = useRef(null); // Placeholder for advanced anomaly detection
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      // Stop the camera when the component is unmounted or user navigates away
      stopProctoring();
    };
  }, []);
  

  const subjects = {
    sql: {
      name: "SQL Basics",
      questions: [
        { question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Sequential Query Language', 'None of the above'], correct: 'Structured Query Language' },
        { question: 'Which keyword is used to retrieve data from a database?', options: ['GET', 'SELECT', 'FETCH', 'RETRIEVE'], correct: 'SELECT' },
        { question: 'Which command is used to delete data from a table?', options: ['DELETE', 'REMOVE', 'TRUNCATE', 'DROP'], correct: 'DELETE' },
        { question: 'Which is used to add a new row in a table?', options: ['ADD', 'INSERT', 'CREATE', 'PUT'], correct: 'INSERT' },
        { question: 'What is used to filter records in SQL?', options: ['WHERE', 'ORDER BY', 'GROUP BY', 'HAVING'], correct: 'WHERE' },
      ]
    },
    java: {
      name: "Java & OOPs",
      questions: [
        { question: 'What is OOP?', options: ['Object-Oriented Programming', 'Object-Oriented Process', 'Object-Ordered Programming', 'None of the above'], correct: 'Object-Oriented Programming' },
        { question: 'Which of these is not a feature of OOP?', options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction', 'Simplicity'], correct: 'Simplicity' },
        { question: 'Which of the following is a Java data type?', options: ['int', 'float', 'boolean', 'All of the above'], correct: 'All of the above' },
        { question: 'Which keyword is used to create an object in Java?', options: ['new', 'class', 'object', 'init'], correct: 'new' },
        { question: 'Which is used to declare a class in Java?', options: ['class ClassName', 'create ClassName', 'object ClassName', 'def ClassName'], correct: 'class ClassName' },
      ]
    },
    dsa: {
      name: "Data Structures & Algorithms (DSA)",
      questions: [
        { question: 'What is the time complexity of accessing an element in an array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correct: 'O(1)' },
        { question: 'Which of the following is not a type of linked list?', options: ['Singly Linked List', 'Doubly Linked List', 'Circular Linked List', 'Sequential Linked List'], correct: 'Sequential Linked List' },
        { question: 'What is the best case time complexity of QuickSort?', options: ['O(n^2)', 'O(n log n)', 'O(log n)', 'O(n)'], correct: 'O(n log n)' },
        { question: 'Which of the following is a stable sorting algorithm?', options: ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Selection Sort'], correct: 'Merge Sort' },
        { question: 'Which data structure follows LIFO principle?', options: ['Queue', 'Stack', 'Linked List', 'Array'], correct: 'Stack' },
      ]
    },
    frontend: {
      name: "Frontend Development",
      questions: [
        { question: 'Which HTML tag is used to define an unordered list?', options: ['<ol>', '<ul>', '<li>', '<list>'], correct: '<ul>' },
        { question: 'What is the purpose of the "alt" attribute in an <img> tag?', options: ['To style the image', 'To provide alternative text if the image cannot load', 'To link the image', 'To define the size of the image'], correct: 'To provide alternative text if the image cannot load' },
        { question: 'Which CSS property is used to change the text color of an element?', options: ['font-color', 'text-color', 'color', 'text-style'], correct: 'color' },
        { question: 'What does "DOM" stand for?', options: ['Document Object Model', 'Display Object Management', 'Digital Operation Mode', 'Document Oriented Management'], correct: 'Document Object Model' },
        { question: 'Which of the following is a valid JavaScript data type?', options: ['Array', 'Object', 'String', 'All of the above'], correct: 'All of the above' },
        { question: 'Which JavaScript method is used to select an HTML element by its ID?', options: ['getElementById()', 'querySelector()', 'getElementsByClass()', 'selectById()'], correct: 'getElementById()' },
        { question: 'What does "CSS" stand for?', options: ['Cascading Style Sheets', 'Computer Style Syntax', 'Creative Style Sheets', 'Custom Style Syntax'], correct: 'Cascading Style Sheets' },
        { question: 'Which HTTP status code indicates a successful request?', options: ['200', '404', '500', '301'], correct: '200' },
        { question: 'What is the purpose of the <head> section in an HTML document?', options: ['To display content on the webpage', 'To include metadata, links, and scripts', 'To add images and multimedia', 'To structure the main content'], correct: 'To include metadata, links, and scripts' },
        { question: 'Which of the following is used to add interactivity to a webpage?', options: ['CSS', 'HTML', 'JavaScript', 'PHP'], correct: 'JavaScript' }
      ]
    }    
  };

  const startAssessment = (subject) => {
    setSelectedSubject(subject);
    setQuizStarted(true);
    setStep(1);
    setStartTime(Date.now()); // Record the time when the quiz starts
    startProctoring();
  };

  const startProctoring = () => {
    //console.log('Initializing AI-driven proctoring...');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          streamRef.current = stream; // Store the stream reference
          webcamRef.current.srcObject = stream;
          //console.log('Camera activated!');
          detectAnomalies(); // Start anomaly detection
        })
        .catch((err) => console.log('Camera not accessible:', err));
    }
  };

  const detectAnomalies = () => {
    //console.log('Running anomaly detection...');
    // Placeholder: logic for detecting anomalies like no face detected or user turning away
    setTimeout(() => {
      const randomAnomaly = Math.random() > 0.7; // Simulate random anomaly
      if (randomAnomaly) {
        setAnomalies(prev => [...prev, 'User is looking away from the screen!']);
      }
    }, 5000); // Check for anomalies after 5 seconds
  };

  const stopProctoring = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop()); // Stop the camera stream
      //console.log('Camera deactivated!');
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    let userScore = 0;
  
    subjects[selectedSubject].questions.forEach((q, i) => {
      if (form[`q${i}`]?.value === q.correct) {
        userScore++;
      }
    });
  
    const calculatedScore = userScore;
    const timeTakenSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
  
    setScore(calculatedScore);
    setTimeTaken(timeTakenSeconds);
    stopProctoring(); // Stop camera after test submission
    setStep(2); // Move to the report step
  
    // Prepare payload
    const payload = {
      name: "Student Name", // Replace with user's name from state/context
      role: "student",
      skillAssessment: subjects[selectedSubject].name,
      timeTaken: parseFloat(timeTakenSeconds),
      score: calculatedScore
    };
  
    //console.log('Sending data to backend:', payload);
  
    // Send data to the backend
    try {
      const response = await fetch('http://localhost:5000/api/v1/scores/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      if (data.success) {
        //console.log('Score successfully saved:', data);
      } else {
        console.error('Error saving score:', data.message);
      }
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };
  
  

  const generateReport = () => {
    const report = {
      score: score,
      totalQuestions: subjects[selectedSubject].questions.length,
      timeTaken: `${timeTaken} seconds`, // Show the time taken in seconds
      behavior: anomalies.length > 0 ? anomalies.join(', ') : 'No anomalies detected', // Report anomalies if any
    };

    //console.log('Generated Report:', report);
    return report;
  };

  return (
    <>
    <Navbar />
    <div className="assessment">
      {step === 0 && (
        <div className="subject-selection">
          <h1>Select a Skill Assessment</h1>
          <div className="subject-cards">
            {Object.keys(subjects).map((subjectKey) => (
              <div key={subjectKey} className="subject-card">
                <h2>{subjects[subjectKey].name}</h2>
                <p>Test your skills in {subjects[subjectKey].name}. Click on the button to start the assessment</p>
                <button className="start-button" onClick={() => startAssessment(subjectKey)}>
                  Start Assessment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 1 && quizStarted && (
        <div>
          <div className="video-container">
            <video ref={webcamRef} autoPlay></video>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="quiz-container">
              {subjects[selectedSubject].questions.map((q, i) => (
                <div key={i} className="question">
                  <p>{q.question}</p>
                  {q.options.map((option, idx) => (
                    <label key={idx}>
                      <input type="radio" name={`q${i}`} value={option} required />
                      {option}
                    </label>
                  ))}
                </div>
              ))}
              <button type="submit" className="submit-button">
                Submit Answers
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="report">
          <h1>Assessment Complete</h1>
          <p>Score: {score} / {subjects[selectedSubject].questions.length}</p>
          <p>Time Taken: {timeTaken} seconds</p>
          <p>Behavior Report: {generateReport().behavior}</p>
          <button onClick={() => {setStep(0); navigate('/')}} className="restart-button" >Go to Home</button>
        </div>
      )}
    </div>
    </>
  );
}

export default Assessment;
