import { useState, useEffect } from "react";
import { getData, setData } from "../Services/storage";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [teacherName, setTeacherName] = useState("");
  useEffect(() => {
    const storedTeachers = getData("teachers");
    setTeachers(storedTeachers);
  }, []);

  const [subject, setSubject] = useState("");
  const [ setEditIndex ] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [classroomInput, setClassroomInput] = useState("");
  const [maxLoad, setMaxLoad] = useState("");
  const [currentLoad, setCurrentLoad] = useState("");
  
  //const user = JSON.parse(localStorage.getItem("user"));
  const API = "https://timetable-backend-sjr8.onrender.com/teachers";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch(API, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then(data => setTeachers(data))
    .catch(err => console.error(err));
}, [token]);

  /*const addOrUpdateTeacher = () => {
       fetch(API, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({
    name,
    subject,
    maxLoadPerWeek: Number(maxLoad),
    currentLoad: Number(currentLoad)
  })
})
  .then(() => {
    setName("");
    setSubject("");
    setMaxLoad("");
    setCurrentLoad("");
    return fetch(API, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  })
  .then(res => res.json())
  .then(data => setTeachers(data));

  };*/

  const handleAddTeacher = () => {
  const newTeacher = {
    id: Date.now(),
    name: teacherName
  };

  const updated = [...teachers, newTeacher];

  setTeachers(updated);
  setData("teachers", updated);

  setTeacherName("");
};

  const editTeacher = (index) => {
    setTeacherName(teachers[index].name);
    setSubject(teachers[index].subject);
    setEditIndex(index);
    setMaxLoad(teachers[index].maxLoadPerWeek);
    setCurrentLoad(teachers[index].currentLoad);
  };

  const deleteTeacher = (id) => {
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(() => {
    fetch(API, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setTeachers(data));
    });
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        👩‍🏫 Teachers Management
      </div>
      {/* FORM */}
      <div style={styles.cardBody}>
      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Teacher Name"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
      />

        <input
          style={styles.input}
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        {/*<input
          style={styles.input}
          type="text"
          placeholder="Assign Classroom "
          value={classroomInput}
          onChange={(e) => setClassroomInput(e.target.value)}
        />*/}
        <input
          style={styles.input}
          type="number"
          placeholder="Max workload (hours/week)"
          value={maxLoad}
          onChange={(e) => setMaxLoad(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Current workload (hours/week)"
          value={currentLoad}
          onChange={(e) => setCurrentLoad(e.target.value)}
        />

        {/*<button
          style={styles.assignBtn}
          onClick={() => {
            if (!classroomInput || editIndex === null) return;
              const updated = [...teachers];
              updated[editIndex].classrooms = updated[editIndex].classrooms || [];
              updated[editIndex].classrooms.push(classroomInput);
              setTeachers(updated);
              setClassroomInput("");
          }}>Assign Classroom
        </button>*/}

        <button style={styles.addBtn} onClick={handleAddTeacher}>
          {/*{editIndex === null ? "Add Teacher" : "Update Teacher"}*/}
        </button>
        </div>
      </div>

      {/* TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Teacher Name</th>
            <th style={styles.th}>Subject</th>
            <th style={styles.th}>Actions</th>
            <th style={styles.th}>Workload</th>
          </tr>
        </thead>

        <tbody>
          {teachers.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No teachers added
              </td>
            </tr>
          ) : (
            teachers.map((t, index) => (
              <tr key={index} onClick={() => setSelectedTeacher(t)} style={{ cursor: "pointer" }}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{t.name}</td>
                <td style={styles.td}>{t.subject}</td>
                <td style={{ ...styles.td, color: t.currentLoad > t.maxLoadPerWeek ? "red" : "green", fontWeight: "700"}}>{t.currentLoad} / {t.maxLoadPerWeek} hrs</td>
                <td style={styles.td}>
                  <button
                    style={styles.editBtn}
                    onClick={() => editTeacher(index)}
                  > Edit
                  </button>
                  <button
                    onClick={() => deleteTeacher(t.id)}
                  > Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {selectedTeacher && (
        <div style={styles.detailsBox}>
          <h3 style={styles.detailsTitle}>👤 Teacher Details</h3>
          <p><b>Name:</b> {selectedTeacher.name}</p>
          <p><b>Subject:</b> {selectedTeacher.subject}</p>
          <input style={styles.input} type="text" placeholder="Assign Classroom " value={classroomInput} onChange={(e) => setClassroomInput(e.target.value)} />

      {/*<button
        style={styles.assignBtn}
        onClick={() => {
          if (!classroomInput || editIndex === null) return;
           const updated = [...teachers];
           updated[editIndex].classrooms.push(classroomInput);
           setTeachers(updated);
           setClassroomInput("");
        }}>Assign Classroom
      </button>*/}
      </div>
    )}
  </div>
  );
}

const styles = {
  form: {
    marginBottom: "20px"
  },
  input: {
    padding: "8px",
    marginRight: "10px"
  },
  detailsBox: {
  marginTop: "25px",
  padding: "20px",
  borderRadius: "14px",
  background: "#f9fbff",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  maxWidth: "400px",
},
detailsTitle: {
  marginBottom: "12px",
  color: "#13758b",
},

  addBtn: {
    padding: "8px 15px",
    backgroundColor: "#370080ff",
    color: "white",
    border: "none",
    cursor: "pointer"
  },
  assignBtn: {
  padding: "8px 12px",
  backgroundColor: "#1db9c3",
  color: "white",
  border: "none",
  cursor: "pointer",
  marginLeft: "10px",
},

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  th: {
    border: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#f2f2f2"
  },
  td: {
    border: "1px solid #ccc",
    padding: "10px",
    textAlign: "center"
  },
  editBtn: {
    backgroundColor: "#FFA500",
    color: "white",
    border: "none",
    padding: "5px 10px",
    marginRight: "5px",
    cursor: "pointer"
  },
  deleteBtn: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer"
  },
  noData: {
    padding: "15px",
    textAlign: "center"
  },

  card: {
  backgroundColor: "#ffffff",
  borderRadius: "18px",
  boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
  overflow: "hidden",
  animation: "fadeIn 0.4s ease-in",
},

cardHeader: {
  background: "linear-gradient(135deg, #960e54ff, #ea1bdcff)",
  color: "white",
  padding: "16px 22px",
  fontSize: "20px",
  fontWeight: "700",
},

cardBody: {
  padding: "25px",
},

}; 
