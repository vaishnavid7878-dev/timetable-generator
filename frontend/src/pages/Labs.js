import { useState, useEffect } from "react";

export default function Labs() {
  const [labs, setLabs] = useState([]);
  const [labName, setLabName] = useState("");
  const [batch, setBatch] = useState("");
  const [capacity, setCapacity] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const SUBJECT_API = "https://timetable-backend-sjr8.onrender.com/subjects";
  const [editIndex, setEditIndex] = useState(null);

  //const user = JSON.parse(localStorage.getItem("user"));
  const API = "https://timetable-backend-sjr8.onrender.com/labs";
  const token = localStorage.getItem("token");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() =>{
    if (!token) return;

    fetch(SUBJECT_API, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setSubjects(data))
      fetchLabs();
  }, [token]);

  const addOrUpdateLab = () => {
    if (!labName || !batch || !capacity || !subjectId) {
      alert("Please fill all fields");
      return;
    }

    fetch(API, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        labName,
        batch,
        capacity: Number(capacity),
        subject_id: Number(subjectId)
      })
    })
      .then(() =>{
        setLabName("");
        setBatch("");
        setCapacity("");
        setSubjectId("");
        setEditIndex(null);
        fetchLabs();      
    });
      //.then(res => res.json())
    //.then(data => setLabs(data));
  };

  const editLab = (index) => {
    setLabName(labs[index].labName);
    setBatch(labs[index].batch);
    setCapacity(labs[index].capacity);
    setSubjectId(labs[index].subject_id);
    setEditIndex(index);
  };

  const deleteLab = (id) => {
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
      .then(data => setLabs(data));
    });
  };

  const fetchLabs = () => {
    fetch(API, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => setLabs(data))
    .catch(err => console.error(err));
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>🔬 Labs Management
      </div>

      <div style={styles.cardBody}>
      {/* FORM */}
      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Lab Name"
          value={labName}
          onChange={(e) => setLabName(e.target.value)}
        />

        <input
          style={styles.input}
          type="text"
          placeholder="Batch (A / B / C)"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
        <select
            style={styles.input}
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

        <button style={styles.addBtn} onClick={addOrUpdateLab}>
          {editIndex === null ? "Add Lab" : "Update Lab"}
        </button>
      </div>

      {/* TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Lab Name</th>
            <th style={styles.th}>Batch</th>
            <th style={styles.th}>Capacity</th>
            <th style={styles.th}>Subject</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {labs.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.noData}>
                No labs added
              </td>
            </tr>
          ) : (
            labs.map((l, index) => (
              <tr key={index}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{l.labName}</td>
                <td style={styles.td}>{l.batch}</td>
                <td style={styles.td}>{l.capacity}</td>
                <td style={styles.td}>{l.subject_name}</td>
                <td style={styles.td}>
                  <button
                    style={styles.editBtn}
                    onClick={() => editLab(index)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteLab(l.id)}
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
    backgroundColor: "#fff",
    borderRadius: "20px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    overflow: "hidden",
  },

  cardHeader: {
    background: "linear-gradient(90deg, #6a11cb, #2575fc)",
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
    borderCollapse: "collapse",
  },

  th: {
    border: "1px solid #ddd",
    padding: "10px",
    backgroundColor: "#f3f3f3",
  },

  td: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center",
  },

  editBtn: {
    backgroundColor: "#FFA500",
    color: "white",
    border: "none",
    padding: "6px 10px",
    marginRight: "5px",
    cursor: "pointer",
  },

  deleteBtn: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },
};