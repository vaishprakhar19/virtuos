import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
function App() {

  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState(null);
  const [collegeName, setCollegeName] = useState(null);
  const [round1marks, setRound1marks] = useState(0);
  const [round2marks, setRound2marks] = useState(0);
  const [round3marks, setRound3marks] = useState(0);
  const [technicalRoundMarks, setTechnicalRoundMarks] = useState(0);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/saveStudent', {
        studentName,
        collegeName,
        round1marks: parseFloat(round1marks),
        round2marks: parseFloat(round2marks),
        round3marks: parseFloat(round3marks),
        technicalRoundMarks: parseFloat(technicalRoundMarks),
      })
      fetchStudents();
      setStudentName('');
      setCollegeName('');
      setRound1marks('');
      setRound2marks('');
      setRound3marks('');
      setTechnicalRoundMarks('');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getStudents');
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching candidate records:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="App">
      <h2>Student Data</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Student Name" onChange={(e) => { setStudentName(e.target.value) }}></input>
        <input type="text" placeholder="College Name" onChange={(e) => { setCollegeName(e.target.value) }}></input>
        <input type="number" placeholder="Round 1 marks" onChange={(e) => { setRound1marks(e.target.value) }}></input>
        <input type="number" placeholder="Round 2 marks" onChange={(e) => { setRound2marks(e.target.value) }}></input>
        <input type="number" placeholder="Round 3 marks" onChange={(e) => { setRound3marks(e.target.value) }}></input>
        <input type="number" placeholder="Technical Round marks" onChange={(e) => { setTechnicalRoundMarks(e.target.value) }}></input>
        <button>Submit</button>
      </form>

      <h2>Student List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>College</th>
            <th>Round 1</th>
            <th>Round 2</th>
            <th>Round 3</th>
            <th>Technical</th>
            <th>Total</th>
            <th>Result</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.student_name}</td>
              <td>{student.college_name}</td>
              <td>{student.round1_marks}</td>
              <td>{student.round2_marks}</td>
              <td>{student.round3_marks}</td>
              <td>{student.technical_round_marks}</td>
              <td>{student.total_marks}</td>
              <td>{student.result}</td>
              <td>{student.student_rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default App;
