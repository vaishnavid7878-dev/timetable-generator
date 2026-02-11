import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable, { Cell } from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

export default function Generate() {
  const [timetable, setTimetable] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const slots = ["Slot1", "Slot2", "Slot3", "Slot4", "Slot5"];
  const slotTiming = {
    Slot1: "9:00 - 10:00",
    Slot2: "10:00 - 11:00",
    Slot3: "11:15 - 12:15",
    Slot4: "1:00 - 2:00",
    Slot5: "2:00 - 3:00",
  };

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {

  fetch("http://127.0.0.1:5000/divisions", {headers})
      .then(res => res.json())
      .then(data => setDivisions(data));
  }, []);

  {/*const generateTimetable = () => {
  const token = localStorage.getItem("token");
  fetch("http://127.0.0.1:5000/generate-timetable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log("API DATA:",data)
      const formatted = {};
      data.forEach(item => {

        if (!formatted[item.division]) {
          formatted[item.division] = {};
        }
         
        if (!formatted[item.division][item.day]) {
          formatted[item.division][item.day] = ["", "", "", "", ""];
        }
        const slotIndex = parseInt(item.slot.replace("Slot", "")) - 1;
        formatted[item.division][item.day][slotIndex] =
          `${item.subject} (${item.teacher}) [${item.room}] {${item.batch}}`;
      });
      setTimetable(formatted);
    })
    .catch(err => console.error(err));
  };*/}
  const generateTimetableData = () => {
  if (!selectedDivision) {
    alert("Please select a division first.");
    return;
  }

  const token = localStorage.getItem("token");

  fetch("http://127.0.0.1:5000/generate-timetable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      const formatted = {};

      data.forEach(item => {
        if (!formatted[item.division]) {
          formatted[item.division] = {};
        }

        if (!formatted[item.division][item.day]) {
          formatted[item.division][item.day] = ["", "", "", "", ""];
        }

        const slotIndex =
          parseInt(item.slot.replace("Slot", "")) - 1;

        formatted[item.division][item.day][slotIndex] =
          `${item.subject} (${item.teacher}) [${item.room}] {${item.batch}}`;
      });

      setTimetable(formatted);
    })
    .catch(err => console.error(err));
};

  const downloadPDF = () => {
    if (!selectedDivision || ! timetable[selectedDivision]) return;

    const doc = new jsPDF();
    doc.text(`Timetable - Division ${selectedDivision}`, 14, 16);

    const tableData = Object.keys(timetable[selectedDivision]).map(day => [
      day,
      ...timetable[selectedDivision][day]
    ]);

    autoTable(doc, {
      head: [["Day", ...slots]],
      body: tableData,
      startY: 22
    });

    doc.save(`${selectedDivision}_timetable.pdf`);
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        📅 Timetable Generator
      </div>
      <br/>

      <div style={styles.topControls}>    
      <select 
        style={styles.input}
        value={selectedDivision}
        onChange={(e) => setSelectedDivision(e.target.value)}
      >
        <option value="">Select Division</option>
        {divisions.map((d) => (
          <option key={d.id} value={d.name}>
            {d.name}
          </option>
        ))}
      </select>

        <button style={styles.addBtn} onClick={generateTimetableData}>
          Generate Timetable
        </button>
      </div>
        <div style={styles.cardBody}>
        {timetable && selectedDivision && timetable[selectedDivision] && (
          <>
            <h3 style={{ textAlign: "center", marginTop: "20px" }}>
              Division : {selectedDivision}
            </h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Day</th>
                  {slots.map((slot, i) => (
                    <th style={styles.th} key={i}>
                      {slot} 
                      <br /> 
                      <span style={{fontSize: "12px", color: "#666"}}>
                        {slotTiming[slot]}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>

        {Object.keys(timetable[selectedDivision]).map((day, i) => (
                <tr key={i}>
                  <td style={styles.td}><b>{day}</b></td>

        {timetable[selectedDivision][day].map((cell, j) => (
                    <td style={styles.td} key={j}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>
              {/*<tbody>
                {Object.keys(timetable[selectedDivision]).map((day, i) => (
                  <div key={division}>
                    <h3>Division {division}</h3>

                    <table style={styles.table}>
                      <tbody>
                        {Object.keys(timetable[division]).map((day, i) => (
                          <tr key={i}>
                            <td style={styles.td}><b>{day}</b></td>
                            {timetable[division][day].map((cell, j) => (
                              <td style={styles.td} key={j}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </tbody>*/}

            <button
              style={{ ...styles.addBtn, marginTop: "20px" }}
              onClick={downloadPDF}
            >
              Download Timetable (PDF)
            </button>
          </>
        )}
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

  topControls: {
    marginBottom: "20px"
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

  input: {
    padding: "10px",
    marginRight: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  addBtn: {
    padding: "10px 18px",
    backgroundColor: "#008080",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "20px"
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
  }
};



{/*import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Generate() {

  const [timetable, setTimetable] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  const slots = ["Slot1","Slot2","Slot3","Slot4","Slot5"];

  useEffect(() => {
    fetch("http://127.0.0.1:5000/divisions",{headers})
      .then(res => res.json())
      .then(data => setDivisions(data));
  }, []);

  const generateTimetable = () => {

    fetch("http://127.0.0.1:5000/generate-timetable",{
      method:"POST",
      headers
    })
    .then(res=>res.json())
    .then(data=>{

      const formatted = {};

      data.forEach(item=>{

        if(!formatted[item.division])
          formatted[item.division] = {};

        if(!formatted[item.division][item.day])
          formatted[item.division][item.day] = ["","","","",""];

        const index = parseInt(item.slot.replace("Slot",""))-1;

        formatted[item.division][item.day][index] =
          `${item.subject} (${item.teacher})`;
      });

      setTimetable(formatted);
    });
  };

  return(
    <div style={styles.card}>

      <div style={styles.cardHeader}>📅 Timetable Generator</div>

      <div style={styles.cardBody}>

        <select
          style={styles.input}
          value={selectedDivision}
          onChange={(e)=>setSelectedDivision(e.target.value)}
        >
          <option value="">Select Division</option>
          {divisions.map(d=>(
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>

        <button style={styles.addBtn} onClick={generateTimetable}>
          Generate Timetable
        </button>

        {timetable && selectedDivision && timetable[selectedDivision] && (

          <>
            <h2 style={{textAlign:"center"}}>
              Division : {selectedDivision}
            </h2>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Day</th>
                  {slots.map(s=>(
                    <th key={s} style={styles.th}>{s}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {Object.keys(timetable[selectedDivision]).map(day=>(
                  <tr key={day}>
                    <td style={styles.td}><b>{day}</b></td>

                    {timetable[selectedDivision][day].map((cell,i)=>(
                      <td key={i} style={styles.td}>{cell}</td>
                    ))}

                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

      </div>
    </div>
  );
}

const styles = {
  card:{background:"#fff",borderRadius:"20px",padding:"20px"},
  cardHeader:{fontSize:"22px",marginBottom:"15px"},
  cardBody:{},
  input:{padding:"10px",marginRight:"10px"},
  addBtn:{padding:"10px",background:"#008080",color:"white",border:"none"},
  table:{width:"100%",marginTop:"20px",borderCollapse:"collapse"},
  th:{border:"1px solid #ccc",padding:"10px"},
  td:{border:"1px solid #ccc",padding:"10px",textAlign:"center"}
};
*/}
