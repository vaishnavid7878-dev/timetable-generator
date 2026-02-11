import { useEffect, useState } from "react";

export default function Classroom() {
  const [classrooms, setClassrooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  
  const API = "http://127.0.0.1:5000/classrooms";
  const token = localStorage.getItem("token");

  useEffect(() =>{
    fetch(API, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setClassrooms(data));
  }, []);

  const addOrUpdateClassroom = () => {
    if (roomName === "" || capacity === "") {
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
      roomName,
      capacity: Number(capacity)
    })
  })
    .then(() => {
      setRoomName("");
      setCapacity("");
      return fetch(API, {
        headers: { Authorization: `Bearer ${token}` }
      });
    })
    .then(res => res.json())
    .then(data => setClassrooms(data));
};

  const editClassroom = (index) => {
    setRoomName(classrooms[index].roomName);
    setCapacity(classrooms[index].capacity);
    setEditIndex(index);
  };

  const deleteClassroom = (id) => {
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
      .then(data => setClassrooms(data));
  });
  };

  return (
    <div style={styles.card}>
      {/* HEADER */}
      <div style={styles.cardHeader}>
        🏫 Classroom Management
      </div>

      {/* BODY */}
      <div style={styles.cardBody}>
        {/* FORM */}
        <div style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Room Name / Number"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />

          <button style={styles.addBtn} onClick={addOrUpdateClassroom}>
            {editIndex === null ? "Add Classroom" : "Update Classroom"}
          </button>
        </div>

        {/* TABLE */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Room</th>
              <th style={styles.th}>Capacity</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {classrooms.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  No classrooms added
                </td>
              </tr>
            ) : (
              classrooms.map((c, index) => (
                <tr key={index}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{c.roomName}</td>
                  <td style={styles.td}>{c.capacity}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.editBtn}
                      onClick={() => editClassroom(index)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteClassroom(c.id)}
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
    borderRadius: "18px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
    overflow: "hidden"
  },

  cardHeader: {
    background: "linear-gradient(135deg, #6a11cb, #2575fc)",
    color: "white",
    padding: "16px 22px",
    fontSize: "20px",
    fontWeight: "700"
  },

  cardBody: {
    padding: "25px"
  },

  form: {
    marginBottom: "20px"
  },

  input: {
    padding: "8px",
    marginRight: "10px"
  },

  addBtn: {
    padding: "8px 15px",
    backgroundColor: "#008080",
    color: "white",
    border: "none",
    cursor: "pointer"
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
