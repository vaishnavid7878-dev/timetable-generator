import { useEffect, useState } from "react";
import { getData, setData } from "../Services/storage";
//import { data } from "react-router-dom";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
  setSubjects(getData("subjects"));
}, []);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [hours, setHours] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  //const user = JSON.parse(localStorage.getItem("user"));
  const API = "http://127.0.0.1:5000/subjects";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch(API, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setSubjects(data))
      .catch(err => console.error(err));
  }, [token]);

  const addOrUpdateSubject = () => {
    if (name === "" || code === "" || hours === "") {
      alert("Please fill all fields");
      return;
    }

    fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      name,
      code,
      hours: Number(hours)
    })
  })
    .then(() => {
      setName("");
      setCode("");
      setData("subjects", addOrUpdateSubject);
      setHours("");
      return fetch(API, {
        headers: { Authorization: `Bearer ${token}` }
      });
    })
    .then(res => res.json())
    .then(data => setSubjects(data));
  };

  const editSubject = (index) => {
    setName(subjects[index].name);
    setCode(subjects[index].code);
    setHours(subjects[index].hours);
    setEditIndex(index);
  };

  const deleteSubject = (id) => {
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(() => {
      fetch(API, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setSubjects(data));
    });
  };

  const totalHours = subjects.reduce(
    (sum, s) => sum + Number(s.hours),
    0
  );

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
       📘Subjects Management
      </div>
      
      <div style={styles.cardBody}>
      {/* FORM */}
      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Subject Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          type="text"
          placeholder="Subject Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Hours / Week"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />

        <button style={styles.addBtn} onClick={addOrUpdateSubject}>
          {editIndex === null ? "Add Subject" : "Update Subject"}
        </button>
      </div>

       {/* TOTAL HOURS */}
      <div style={styles.totalBox}>
        Total Weekly Hours: <b>{totalHours}</b>
      </div>

      {/* TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Subject Name</th>
            <th style={styles.th}>Code</th>
            <th style={styles.th}>Hours / Week</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {subjects.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.noData}>
                No subjects added
              </td>
            </tr>
          ) : (
            subjects.map((s, index) => (
              <tr key={index}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{s.name}</td>
                <td style={styles.td}>{s.code}</td>
                <td style={styles.td}>{s.hours}</td>
                <td style={styles.td}>
                  <button
                    style={styles.editBtn}
                    onClick={() => editSubject(index)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteSubject(s.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}

const styles = {
  card: {
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
  overflow: "hidden",
},

cardHeader: {
  background: "linear-gradient(90deg, #4822d3, #4a90ff)",
  color: "white",
  padding: "18px 24px",
  fontSize: "22px",
  fontWeight: "700",
},

cardBody: {
  padding: "25px",
},

form: {
  display: "flex",
  gap: "15px",
  marginBottom: "25px",
  flexWrap: "wrap",
},

input: {
  padding: "10px",
  minWidth: "200px",
  borderRadius: "6px",
  border: "1px solid #ccc",
},

addBtn: {
  padding: "10px 18px",
  backgroundColor: "#008080",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
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
  }
};