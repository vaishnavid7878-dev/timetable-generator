import { useState, useEffect } from "react";

export default function Constraints() {
  const [constraints, setConstraints] = useState({
    teacherOneClass: true,
    roomOneClass: true,
    labsOnlyForLabs: true,
    respectSubjectHours: true,
  });

  useEffect(() => {
    localStorage.setItem("constraints", JSON.stringify(constraints));
  }, [constraints]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setConstraints({ ...constraints, [name]: checked });
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>⚙️ Constraints</div>

      <div style={styles.cardBody}>
        <p style={styles.info}>
          These are <b>hard constraints</b>. Timetable generation will strictly
          follow these rules.
        </p>

        <div style={styles.constraintItem}>
          <input
            type="checkbox"
            name="teacherOneClass"
            checked={constraints.teacherOneClass}
            onChange={handleChange}
          />
          <label> One teacher can teach only one class at a time</label>
        </div>

        <div style={styles.constraintItem}>
          <input
            type="checkbox"
            name="roomOneClass"
            checked={constraints.roomOneClass}
            onChange={handleChange}
          />
          <label> One classroom can have only one lecture at a time</label>
        </div>

        <div style={styles.constraintItem}>
          <input
            type="checkbox"
            name="labsOnlyForLabs"
            checked={constraints.labsOnlyForLabs}
            onChange={handleChange}
          />
          <label> Lab subjects must be scheduled only in labs</label>
        </div>

        <div style={styles.constraintItem}>
          <input
            type="checkbox"
            name="respectSubjectHours"
            checked={constraints.respectSubjectHours}
            onChange={handleChange}
          />
          <label> Subject weekly hours must not exceed limit</label>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 14px 35px rgba(0,0,0,0.15)",
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

  info: {
    marginBottom: "20px",
    color: "#333",
    fontWeight: "500",
  },

  constraintItem: {
    marginBottom: "15px",
    fontSize: "16px",
  },
};
