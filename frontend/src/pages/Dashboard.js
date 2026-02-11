import { Link, Outlet, useNavigate } from "react-router-dom";
import profileImg from "../Icon.jpg";
import { useState, useRef, useEffect } from "react";
import "../App.css";

export default function Dashboard() {
  const [showMenu, setShowMenu] = useState(false);
const menuRef = useRef(null);
const navigate = useNavigate();

useEffect(() => {
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  return (
    <div style={styles.wrapper}>
      
      {/* Sidebar */}
      <div style={styles.sidebar}>
        
        {/*<h2 style={styles.logo}>Timetable</h2>*/}
        <br/>
        <br/><br/>
        <br/>
        {/*<Link style={styles.link}  to="profile">Profile</Link>*/}
        <Link style={styles.link} 
        onMouseEnter={e => e.target.style.transform = "translateX(10px)"}
        onMouseLeave={e => e.target.style.transform = "translateX(0px)"} to="teachers">Teachers</Link>
        <Link style={styles.link}
        onMouseEnter={e => e.target.style.transform = "translateX(10px)"}
        onMouseLeave={e => e.target.style.transform = "translateX(0px)"} to="subjects">Subjects</Link>
        <Link style={styles.link}
        onMouseEnter={e => e.target.style.transform = "translateX(10px)"}
        onMouseLeave={e => e.target.style.transform = "translateX(0px)"} to="classrooms">Classrooms</Link>
        <Link style={styles.link}
        onMouseEnter={e => e.target.style.transform = "translateX(10px)"}
        onMouseLeave={e => e.target.style.transform = "translateX(0px)"} to="divisions">Divisions</Link>
        <Link style={styles.link}
        onMouseEnter={e => e.target.style.transform = "translateX(10px)"}
        onMouseLeave={e => e.target.style.transform = "translateX(0px)"} to="labs">Labs</Link>
        <Link style={styles.link}
        onMouseEnter={e => e.target.style.transform = "translateX(10px)"}
        onMouseLeave={e => e.target.style.transform = "translateX(0px)"} to="allocation">Allocation</Link>
        <Link style={styles.link}
        onMouseEnter={e => e.target.style.transform = "translateX(10px)"}
        onMouseLeave={e => e.target.style.transform = "translateX(0px)"} to="constraints">Constraints</Link>
        <Link style={styles.link}
        onMouseEnter={e => e.target.style.transform = "translateX(10px)"}
        onMouseLeave={e => e.target.style.transform = "translateX(0px)"} to="generate">Generate</Link>
      </div>

      {/* Right Content */}
      <div style={styles.main}>  
        <div style={styles.header}>
        <div style={styles.marquee}>
          <span style={styles.marqueeText}>
            Automatic <span style={styles.headerMain}>Timetable</span> Generator 
          </span>
        </div>
        </div>

      <div style={styles.profileWrapper} ref={menuRef}>
  <img
    src={profileImg}
    alt="Profile"
    style={styles.profileImg}
    onClick={() => setShowMenu(!showMenu)}
  />

  {showMenu && (
    <div style={styles.dropdown}>
      <div
        style={styles.dropdownItem}
        onClick={() => {
          setShowMenu(false);
          navigate("profile");
        }}
      >
        👤 Profile
      </div>

      <div
        style={styles.dropdownItem}
        onClick={() => {
          setShowMenu(false);
          navigate("/logout");
        }}
      >
        🚪 Logout
      </div>
    </div>
  )}
</div>
  

        <div style={styles.content}>
          <Outlet />
        </div>
      </div>

    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  
  headerMain: {
    color: "#ffe600",
    textShadow: "0 0 12px hsla(54, 100%, 50%, 0.80)",
  },

  headerGlow: {
    //color: "#ffe600",
    //textShadow: "0 0 12px rgba(255,230,0,0.8)",
    opacity: 10,
  },

  sidebar: {
    width: "230px",
    backgroundColor: "#1c2c4c",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  },

  /*logo: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "22px",
  },*/

  link: {
    color: "white",
  textDecoration: "none",
  padding: "16px",
  marginBottom: "12px",
  borderRadius: "14px",
  fontWeight: "600",
  background: "linear-gradient(135deg, #4c768d, #5fa4bd)",
  transition: "all 0.3s ease",
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f4f8f8ff",
  },

  header: {
   background: "linear-gradient(270deg, #13758b, #1db9c3, #13758b)",
   backgroundSize: "400% 400%",
   borderRadius: "20px",
   color: "white",
   padding: "22px",
   fontSize: "30px",
   textAlign: "center",
   fontWeight: "900",
   letterSpacing: "2px",
   animation: "gradientMove 8s ease infinite",
  },
  
  marquee: {
  overflow: "hidden",
  whiteSpace: "nowrap",
},

marqueeText: {
  display: "inline-block",
  paddingLeft: "100%",
  animation: "moveText 12s linear infinite",
  fontWeight: "900",
  letterSpacing: "3px",
},

  profileImg: {
   width: "50px",
   height: "50px",
   borderRadius: "50%",
   objectFit: "cover",
   border: "3px solid white",
   cursor: "pointer",
  },

  profileWrapper: {
  position: "relative",
},

dropdown: {
  position: "absolute",
  top: "60px",
  right: "0",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  width: "160px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  overflow: "hidden",
  zIndex: 90,
},

dropdownItem: {
  padding: "12px",
  cursor: "pointer",
  fontWeight: "600",
  color: "#333",
  transition: "background 0.2s",
},

  content: {
    padding: "30px",
    overflowY: "auto",
  },
};


