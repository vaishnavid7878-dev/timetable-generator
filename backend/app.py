from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import datetime
import sqlite3
import json
from werkzeug.security import generate_password_hash, check_password_hash
from database import init_db

app = Flask(__name__)
CORS(app, support_credentials=True)

init_db()

app.config["SECRET_KEY"] = "secret123"

def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

# ================= TOKEN CHECK =================
def token_required():
    token = request.headers.get("Authorization")
    if not token:
        return None

    if token.startswith("Bearer "):
        token = token.split(" ")[1]

    try:
        data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        return data
    except:
        return None

# ============= Registration ==============
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields required"}), 400

    conn = get_db()
    cursor = conn.cursor()

    # Check user exists
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    existing = cursor.fetchone()

    if existing:
        return jsonify({"error": "Email already exists"}), 400

    # Hash password
    hashed_password = generate_password_hash(password)

    #role = data.get("role", "staff")    #default role

    cursor.execute("""
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
    """, (name, email, hashed_password))

    conn.commit()
    conn.close()
    return jsonify({"message": "User registered successfully"})

# ================= LOGIN =================
@app.route("/login", methods=["POST", "OPTIONS"])
def login():

    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200

    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    conn = get_db()
    cursor = conn.cursor()

    # Get user from database
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "User not found"}), 401

    stored_password = user["password"]

    # Check hashed password
    if not check_password_hash(stored_password, password):
        return jsonify({"error": "Invalid password"}), 401

    # Create JWT token
    token = jwt.encode(
        {
            "email": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        },
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    conn.close()

    return jsonify({
        "token": token,
        "user": {
            "email": email,
            "name": user["name"]
        }
    })       

# ================= TEACHERS =================
@app.route("/teachers", methods=["GET", "POST"])
def teachers():
    token = token_required()
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()    

    if request.method == "GET":
        cursor.execute("SELECT * FROM teachers")
        rows = cursor.fetchall()

        teachers = []
        for r in rows:
            teachers.append({
                "id": r[0],
                "name": r[1],
                "subject": r[2],
                "maxLoadPerWeek": r[3],
                "currentLoad": r[4]
                #"classrooms": json.loads(r[5]) if r[5] else[]
            })
        return jsonify(teachers)

    if request.method == "POST":
        data = request.json
        cursor.execute("""
            INSERT INTO teachers(name, subject, maxLoadPerWeek, currentLoad) 
            VALUES (?, ?, ?, ?)
        """, (
            data["name"],
            data["subject"],
            data["maxLoadPerWeek"],
            data["currentLoad"],
            #json.dumps([])
        ))  
        conn.commit()
        return jsonify({"message": "Teacher added"})     


@app.route("/teachers/<int:id>", methods=["DELETE"])
def delete_teacher(id):
    token = token_required()
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM teachers WHERE id=?", (id,))
    conn.commit()

    return jsonify({"message": "Teacher deleted"})

@app.route("/classrooms", methods=["GET", "POST"])
def classrooms():
    token = token_required()
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()

    # GET classrooms
    if request.method == "GET":
        cursor.execute("SELECT * FROM classrooms")
        rows = cursor.fetchall()

        data = []
        for r in rows:
            data.append({
                "id": r[0],
                "roomName": r[1],
                "capacity": r[2]
            })

        return jsonify(data)

    # POST classroom
    if request.method == "POST":
        data = request.json

        cursor.execute(
            "INSERT INTO classrooms (roomName, capacity) VALUES (?, ?)",
            (data["roomName"], data["capacity"])
        )
        conn.commit()

        return jsonify({"message": "Classroom added"})

@app.route("/classrooms/<int:id>", methods=["DELETE"])
def delete_classroom(id):
    token = token_required()
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM classrooms WHERE id=?", (id,))
    conn.commit()

    return jsonify({"message": "Classroom deleted"})

@app.route("/subjects", methods=["GET", "POST"])
def subjects():
    token = token_required()
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()

    # GET
    if request.method == "GET":
        cursor.execute("SELECT * FROM subjects")
        rows = cursor.fetchall()

        data = []
        for r in rows:
            data.append({
                "id": r[0],
                "name": r[1],
                "code": r[2],
                "hours": r[3]
            })

        return jsonify(data)

    # POST
    if request.method == "POST":
        data = request.json

        cursor.execute(
            "INSERT INTO subjects (name, code, hours) VALUES (?, ?, ?)",
            (data["name"], data["code"], data["hours"])
        )
        conn.commit()

        return jsonify({"message": "Subject added"})

@app.route("/subjects/<int:id>", methods=["DELETE"])
def delete_subject(id):
    token = token_required()
    if not token:
        return jsonify({"error": "Unauthorized"}), 401
 
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM subjects WHERE id=?", (id,))
    conn.commit()

    return jsonify({"message": "Subject deleted"})

# ================= LABS =================
@app.route("/labs", methods=["GET", "POST"])
def labs():
    token = token_required()
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()

    if request.method == "GET":
        cursor.execute("""
          SELECT labs.id, labs.labName, labs.batch, labs.capacity, labs.subject_id, subjects.name AS subject_name
          FROM labs LEFT JOIN subjects ON labs.subject_id = subjects.id
        """)
        rows = cursor.fetchall()

        labs = []
        for r in rows:
            labs.append({
                "id": r["id"],
                "labName": r["labName"],
                "batch": r["batch"],
                "capacity": r["capacity"],
                "subject_id": r["subject_id"],
                "subject_name": r["subject_name"]
            })

        return jsonify(labs)

    if request.method == "POST":
        data = request.json

        cursor.execute("""
            INSERT INTO labs (labName, batch, capacity, subject_id)
            VALUES (?, ?, ?, ?)
        """, (
            data["labName"],
            data["batch"],
            data["capacity"],
            data["subject_id"]
        ))

        conn.commit()
        return jsonify({"message": "Lab added successfully"})

@app.route("/labs/<int:id>", methods=["DELETE"])
def delete_lab(id):
    token = token_required()
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM labs WHERE id=?", (id,))
    conn.commit()

    return jsonify({"message": "Lab deleted"})

# =====================ALLOCATIONS=====================
@app.route("/allocations", methods=["GET", "POST"])
def allocations():
    token = token_required()
    if not token:
        return jsonify({"error": "Unauthorized"}),401
    
    conn = get_db()
    cursor = conn.cursor()

    #GET allocations
    if request.method == "GET":
        #cursor.execute("""
        #  SELECT allocations.id, teachers.name, subjects.name, classrooms.roomName, labs.labName, divisions.name, allocations.hours 
        #   FROM allocations
        #   JOIN teachers ON allocations.teacher_id = teachers.id
        #   JOIN subjects ON allocations.subject_id = subjects.id
        #   LEFT JOIN classrooms ON allocations.classroom_id = classrooms.id
        #   LEFT JOIN labs ON allocations.lab_id = labs.id
        #   LEFT JOIN divisions ON allocations.division_id = divisions.id
        #""")
        cursor.execute("""
            SELECT allocations.id, allocations.teacher_id, allocations.subject_id, allocations.classroom_id, allocations.lab_id, allocations.division_id,
            allocations.hours,
            teachers.name,
            subjects.name,
            COALESCE(classrooms.roomName, labs.labName),
            divisions.name
            FROM allocations
            JOIN teachers ON allocations.teacher_id = teachers.id
            JOIN subjects ON allocations.subject_id = subjects.id
            LEFT JOIN classrooms ON allocations.classroom_id = classrooms.id
            LEFT JOIN labs ON allocations.lab_id = labs.id
            LEFT JOIN divisions ON allocations.division_id = divisions.id
        """)
        rows = cursor.fetchall()

        data = []
        for r in rows:
            #data.append({
            #   "id": r[0],
            #   "teacher": r[1],
            #   "subject": r[2],
            #   "classroom": r[3] if r[3] else r[4],
            #   "division": r[5],
            #   "hours": r[6],
            #})
            data.append({
                "id": r[0],
                "teacher_id": r[1],
                "subject_id": r[2],
                "classroom_id": r[3],
                "lab_id": r[4],
                "division_id": r[5],
                "hours": r[6],
                "teacher": r[7],
                "subject": r[8],
                "classroom": r[9],
                "division": r[10]
            })
        return jsonify(data)

    #POST allocation
    if request.method == "POST":
        data = request.json

        classroom_id = data.get("classroom_id")
        lab_id = data.get("lab_id")
        #At least one must exist
        if not classroom_id and not lab_id:
            return jsonify({"error": "Invalid selection"}), 400

        cursor.execute("""
           INSERT INTO allocations(teacher_id, subject_id, classroom_id, lab_id, division_id, hours)
           VALUES (?,?,?,?,?,?)
        """, (
           data["teacher_id"],
           data["subject_id"],
           data.get("classroom_id"),
           data.get("lab_id"),
           data.get("division_id"),
           data.get("hours")
        ))

        conn.commit()
        return jsonify({"message": "Allocation added"})

@app.route("/allocations/<int:id>", methods=["DELETE"])
def delete_allocation(id):
    token = token_required()
    if not token:
        return jsonify({"error": "unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM allocations WHERE id=?", (id,))
    conn.commit()

    return jsonify({"message":"Allocation deleted"})

@app.route("/allocations/<int:id>", methods=["PUT"])
def update_allocation(id):

    token = token_required()
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE allocations
        SET teacher_id=?,
            subject_id=?,
            classroom_id=?,
            lab_id=?,
            division_id=?,
            hours=?
        WHERE id=?
    """, (
        data["teacher_id"],
        data["subject_id"],
        data.get("classroom_id"),
        data.get("lab_id"),
        data.get("division_id"),
        data.get("hours"),
        id
    ))

    conn.commit()

    return jsonify({"message": "Allocation updated"})

# ================= CONSTRAINTS =================
@app.route("/constraints", methods=["GET", "POST"])
def constraints():
    token = token_required()
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()

    # ===== GET =====
    if request.method == "GET":
        cursor.execute("SELECT * FROM constraints ORDER BY id DESC LIMIT 1")
        row = cursor.fetchone()

        if not row:
            return jsonify({})

        return jsonify({
            "teacherMaxHours": row[1],
            "allowLabOnly": bool(row[2]),
            "maxSubjectsPerDay": row[3]
        })

    # ===== POST =====
    if request.method == "POST":

        data = request.json

        cursor.execute("""
            INSERT INTO constraints (teacherMaxHours, allowLabOnly, maxSubjectsPerDay)
            VALUES (?, ?, ?)
        """, (
            data["teacherMaxHours"],
            int(data["allowLabOnly"]),
            data["maxSubjectsPerDay"]
        ))

        conn.commit()

        return jsonify({"message": "Constraints saved"})

#----------GENERATE TIMETABLE------------
@app.route("/generate-timetable", methods=["POST", "GET"])
def generate_timetable():
    token = token_required()
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()

    # Load Constraints
    cursor.execute("SELECT * FROM constraints ORDER BY id DESC LIMIT 1")
    constraint = cursor.fetchone()
    max_hours = constraint[1] if constraint else 20

    teacher_hours = {}

    import random
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    slots = ["Slot1", "Slot2", "Slot3", "Slot4", "Slot5"]

    # Clear old timetable
    cursor.execute("DELETE FROM timetable")

    # Get allocations
    cursor.execute("""
        SELECT allocations.teacher_id, 
        allocations.subject_id,
        allocations.classroom_id, 
        allocations.lab_id,
        allocations.division_id,
        allocations.hours,
        teachers.name,
        subjects.name,
        COALESCE(classrooms.roomName, labs.labName),
        labs.batch,
        divisions.name
        FROM allocations
        JOIN teachers ON allocations.teacher_id = teachers.id
        JOIN subjects ON allocations.subject_id = subjects.id
        LEFT JOIN classrooms ON allocations.classroom_id = classrooms.id
        LEFT JOIN labs ON allocations.lab_id = labs.id
        LEFT JOIN divisions ON allocations.division_id = divisions.id
    """)

    allocations = cursor.fetchall()

    # Create timetable grid
    timetable = {}

    teacher_schedule = {}
    room_schedule = {}
    lab_schedule = {}
    
    # Allocation Logic
    for alloc in allocations:
        division_id = alloc[4]
        teacher_name = alloc[6]
        subject_name = alloc[7]
        room_name = alloc[8]
        batch_name = alloc[9]
        division_name = alloc[10]
        hours = alloc[5]

        is_lab = alloc[3] is not None

        if division_name not in timetable:
            timetable[division_name] = {
                day: [None]*len(slots) for day in days
            }

        if teacher_name not in teacher_hours:
            teacher_hours[teacher_name] = 0

        placed = 0
        attempts = 0

        while placed < hours and attempts < 200:
            attempts += 1

            # Teacher max workload
            if teacher_hours[teacher_name] >= max_hours:
                break

            day = random.choice(days)

            # Lab double slot
            if is_lab:
                slot_index = random.randint(0, len(slots)-2)
                slot_indexes = [slot_index, slot_index+1]
            else:
                slot_index = random.randint(0, len(slots)-1)
                slot_indexes = [slot_index]

            # Conflict check
            conflict = False

            for si in slot_indexes:
                slot_name = slots[si]

                if timetable[division_name][day][si] is not None:
                    conflict = True
                    break

                if f"{teacher_name}{day}{slot_name}" in teacher_schedule:
                    conflict = True
                    break

                if f"{room_name}{day}{slot_name}" in room_schedule:
                    conflict = True
                    break

                if f"{batch_name}{day}{slot_name}" in lab_schedule:
                    conflict = True
                    break

            if conflict:
                continue

            # Assign slot
            for si in slot_indexes:
                slot_name = slots[si]
                timetable.setdefault(division_name, {})
                timetable[division_name].setdefault(day, [None]*len(slots))

                timetable[division_name][day][si] = (
                    teacher_name,
                    subject_name,
                    room_name,
                    slot_name,
                    batch_name
                )

                teacher_schedule[f"{teacher_name}{day}{slot_name}"] = True
                room_schedule[f"{room_name}{day}{slot_name}"] = True
                lab_schedule[f"{batch_name}{day}{slot_name}"] = True

            placed += len(slot_indexes)
            teacher_hours[teacher_name] += len(slot_indexes)

    # Save timetable
    for division in timetable:
        for day in timetable[division]:
            for slot_index, value in enumerate(timetable[division][day]):
                if value:
                    teacher, subject, room, slot, batch = value

                    cursor.execute("""
                        INSERT INTO timetable (division, day, slot, teacher, subject, room, batch)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (division, day, slot, teacher, subject, room, batch))

    conn.commit()

    # Return timetable
    cursor.execute("SELECT division, day, slot, teacher, subject, room, batch FROM timetable")
    rows = cursor.fetchall()

    data = []
    for r in rows:
        data.append({
            "division": r[0],
            "day": r[1],
            "slot": r[2],
            "teacher": r[3],
            "subject": r[4],
            "room": r[5],
            "batch": r[6]
        })

    return jsonify(data)
    
@app.route("/timetable", methods=["GET"])
def get_timetable():

    token = token_required()
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT division_id, day, slot, teacher, subject, room, batch FROM timetable")
    rows = cursor.fetchall()

    data = []

    for r in rows:
        data.append({
            "division_id": r[0],
            "day": r[1],
            "slot": r[2],
            "teacher": r[3],
            "subject": r[4],
            "room": r[5],
            "batch": r[6]
        })

    return jsonify(data)

# ================= DIVISIONS =================
@app.route("/divisions", methods=["GET", "POST"])
def divisions():
    token = token_required()
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()

    # GET divisions
    if request.method == "GET":
        cursor.execute("SELECT * FROM divisions")
        rows = cursor.fetchall()

        result = []
        for r in rows:
            result.append({
                "id": r["id"],
                "name": r["name"]
            })

        return jsonify(result)

    # POST division
    if request.method == "POST":
        data = request.json
        name = data.get("name")

        if not name:
            return jsonify({"error": "Division name required"}), 400

        cursor.execute("INSERT INTO divisions (name) VALUES (?)", (name,))
        conn.commit()

        return jsonify({"message": "Division added"})    

# ===== DELETE DIVISION =====
@app.route("/divisions/<int:id>", methods=["DELETE"])
def delete_division(id):

    token = token_required()
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM divisions WHERE id = ?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Division deleted"})

if __name__ == "__main__":
    app.run(debug=True)

