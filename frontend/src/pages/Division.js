import { useState, useEffect } from "react";

export default function Division() {
  const [divisions, setDivisions] = useState([]);
  const [divisionName, setDivisionName] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  // ===== Fetch Divisions =====
  const fetchDivisions = async () => {
    const res = await fetch("http://127.0.0.1:5000/divisions", { headers });
    const data = await res.json();
    setDivisions(data);
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  // ===== Add Division =====
  const addDivision = async () => {
    if (!divisionName) {
      alert("Enter division name");
      return;
    }

    await fetch("http://127.0.0.1:5000/divisions", {
      method: "POST",
      headers,
      body: JSON.stringify({ name: divisionName })
    });

    setDivisionName("");
    fetchDivisions();
  };

  // ===== Delete Division =====
  const deleteDivision = async (id) => {
    await fetch(`http://127.0.0.1:5000/divisions/${id}`, {
      method: "DELETE",
      headers
    });

    fetchDivisions();
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        🏫 Division Management
      </div>

      <div style={styles.cardBody}>
        
        {/* Form */}
        <div style={styles.form}>
          <input
            style={styles.input}
            placeholder="Division Name (Ex: FY-A, SY-B)"
            value={divisionName}
            onChange={(e) => setDivisionName(e.target.value)}
          />

          <button style={styles.addBtn} onClick={addDivision}>
            Add Division
          </button>
        </div>

        {/* Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Division Name</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {divisions.length === 0 ? (
              <tr>
                <td colSpan="3" style={styles.noData}>
                  No divisions added
                </td>
              </tr>
            ) : (
              divisions.map((d, i) => (
                <tr key={d.id}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={styles.td}>{d.name}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteDivision(d.id)}
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
    background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
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
    minWidth: "220px",
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

  deleteBtn: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
    borderRadius: "4px"
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },
};