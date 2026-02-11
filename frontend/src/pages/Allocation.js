import { useState, useEffect } from "react";

export default function Allocation() {
  const [allocations, setAllocations] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedLab, setSelectedLab] = useState("");
  const [labs, setLabs] = useState([]);
  const [hours, setHours] = useState("");
  const [batch, setBatch] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [division, setDivision] = useState("");

  const [formData, setFormData] = useState({
    teacher_id: "",
    subject_id: "",
    classroom_id: "",
    lab_id: "",
    division_id: "",
    hours: ""
  })

  const batches = [...new Set(labs.map(l => l.batch))];
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    if (!token) return;

    fetchTeachers();
    fetchSubjects();
    fetchDivisions();
    fetchClassrooms();
    fetchDivisions();
    fetchLabs();
    fetchAllocations();
  }, [token]);

  const fetchTeachers = async () => {
    const res = await fetch("https://timetable-backend-sjr8.onrender.com/teachers", { headers });
    const data = await res.json();
    setTeachers(data);
  };

  const fetchSubjects = async () => {
    const res = await fetch("https://timetable-backend-sjr8.onrender.com/subjects", { headers });
    const data = await res.json();
    setSubjects(data);
  };
  
  const fetchDivisions = async () => {
    const res = await fetch("https://timetable-backend-sjr8.onrender.com/divisions", { headers });
    const data = await res.json();
    setDivisions(data);
  };

  const fetchClassrooms = async () => {
    const res = await fetch("https://timetable-backend-sjr8.onrender.com/classrooms", { headers });
    const data = await res.json();
    setClassrooms(data);
  };

  const fetchLabs = async () => {
    const res = await fetch("https://timetable-backend-sjr8.onrender.com/labs", { headers });
    const data = await res.json();
    setLabs(data);
  };

  const fetchAllocations = async () => {
    const res = await fetch("https://timetable-backend-sjr8.onrender.com/allocations", { headers });
    const data = await res.json();
    setAllocations(data);
  };

  // ================= ADD / UPDATE =================
  {/*const addOrUpdateAllocation = async () => {
    if (!teacher || !subject || !hours) {
      alert("Please fill all fields");
      return;
    }

    if (!selectedClassroom && !selectedLab) {
      alert("Select classroom OR lab");
      return;
    }

    const teacherObj = teachers.find(t => t.name === teacher);
    const subjectObj = subjects.find(s => s.name === subject);

    const classroomObj = classrooms.find(
      c => c.roomName === selectedClassroom
    );

    const labObj = labs.find(
      l => l.labName === selectedLab
    );

    await fetch("http://127.0.0.1:5000/allocations", {
      method: "POST",
      headers,
      body: JSON.stringify({
        teacher_id: teacherObj?.id,
        subject_id: subjectObj?.id,
        classroom_id: classroomObj ? classroomObj.id : null,
        lab_id: labObj ? labObj.id : null,
        batch: batch,
        division_id: division,
        hours: Number(hours)
      })
    });

    fetchAllocations();
    resetForm();
  };
  */}

  // ================= ADD / UPDATE =================
  const addOrUpdateAllocation = async () => {

    const teacherObj = teachers.find(t => t.name === teacher);
    const subjectObj = subjects.find(s => s.name === subject);
    const classroomObj = classrooms.find(c => c.roomName === selectedClassroom);
    const labObj = labs.find(l => l.labName === selectedLab);

    const payload = {
      teacher_id: teacherObj?.id,
      subject_id: subjectObj?.id,
      classroom_id: classroomObj ? classroomObj.id : null,
      lab_id: labObj ? labObj.id : null,
      division_id: division,
      hours: Number(hours)
    };

    const url = editId
      ? `http://127.0.0.1:5000/allocations/${editId}`
      : "http://127.0.0.1:5000/allocations";

    const method = editId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload)
    });

    fetchAllocations();
    resetForm();
  };

  // ================= EDITS =================
  const editAllocation = (index) => {
    const a = allocations[index];

      setTeacher(a.teacher);
      setSubject(a.subject);
      setSelectedClassroom(a.classroom_id || "");
      setSelectedLab(a.lab_id || "");
      setDivision(a.division_id || "");
      setHours(a.hours);

      setEditIndex(index);
      setEditId(a.id);
  };
  // ================= DELETE =================
  const deleteAllocation = async (id) => {
    await fetch(`http://127.0.0.1:5000/allocations/${id}`, {
      method: "DELETE",
      headers
    });

    fetchAllocations();
  };

  const resetForm = () => {
    setTeacher("");
    setSubject("");
    setSelectedClassroom("");
    setSelectedLab("");
    setDivision("");
    setHours("");
    setEditId(null);
    setEditIndex(null);
  };

  // ================= WORKLOAD =================
  const teacherWorkload = (teacherName) =>
    allocations
      .filter((a) => a.teacher === teacherName)
      .reduce((sum, a) => sum + Number(a.hours), 0);

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>🔗 Allocation Management</div>

      <div style={styles.cardBody}>
        {/* FORM */}
        <div style={styles.form}>
          <select
            style={styles.input}
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
          >
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            style={styles.input}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            style={styles.input}
            value={selectedClassroom}
            onChange={(e) => {
              setSelectedClassroom(e.target.value);
              setSelectedLab("");
            }}
          >
            <option value="">Select Classroom</option>
            {classrooms.map((c) => (
            <option key={c.id} value={c.roomName}>
              {c.roomName}
            </option>
            ))}
          </select>

          <select
            style={styles.input}
            value={selectedLab}
            onChange={(e) => {
              setSelectedLab(e.target.value);
              setSelectedClassroom("");
            }}
          >
            <option value="">Select Lab</option>
            {labs.map((l) => (
              <option key={l.id} value={l.labName}>
                {l.labName}
              </option>
            ))}
          </select>

          <select
            style={styles.input}
            value={batch}
            onChange={(e) => {
              setBatch(e.target.value);
              setSelectedClassroom("");
            }}
          >
            <option value="">Select Batch</option>
            {batches.map((b, index) => (
              <option key={index} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            style={styles.input}
            value={division}
            onChange={(e) => setDivision(e.target.value)}
          >
            <option value="">Select Division</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <input
            style={styles.input}
            type="number"
            placeholder="Hours / Week"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />

          {/*<button style={styles.addBtn} onClick={addOrUpdateAllocation}>
            Add Allocation
          </button>*/}
          <button style={styles.addBtn} onClick={addOrUpdateAllocation}>
            {editIndex === null ? "Add Allocation" : "Update Allocation"}
          </button>
        </div>

        {/* TABLE */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Teacher</th>
              <th style={styles.th}>Subject</th>
              <th style={styles.th}>Room</th>
              <th style={styles.th}>Hours</th>
              <th style={styles.th}>Workload</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {allocations.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.noData}>
                  No allocations added
                </td>
              </tr>
            ) : (
              allocations.map((a, i) => (
                <tr key={a.id}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={styles.td}>{a.teacher}</td>
                  <td style={styles.td}>{a.subject}</td>
                  <td style={styles.td}>{a.classroom}</td>
                  <td style={styles.td}>{a.hours}</td>
                  <td style={styles.td}>
                    {teacherWorkload(a.teacher)} hrs
                  </td>
                  <td style={styles.td}>                 
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteAllocation(a.id)}
                    >
                      Delete
                    </button>
                    <button
                      style={styles.editBtn}
                      onClick={() => editAllocation(i)}
                    >
                      Edit
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
    background: "linear-gradient(90deg, #11998e, #38ef7d)",
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
    minWidth: "180px",
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
