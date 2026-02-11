import sqlite3

def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    # USERS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
    )
    """)

    # TEACHERS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        subject TEXT,
        maxLoadPerWeek INTEGER,
        currentLoad INTEGER
    )
    """)

    # SUBJECTS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        code TEXT,
        hours INTEGER
    )
    """)

    # CLASSROOMS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS classrooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roomName TEXT,
        capacity INTEGER
    )
    """)

    # LABS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS labs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        labName TEXT,
        batch TEXT,
        capacity INTEGER,
        subject_id INTEGER
    )
    """)

    # DIVISIONS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS divisions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
    )
    """)

    # ALLOCATIONS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS allocations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        teacher_id INTEGER,
        subject_id INTEGER,
        classroom_id INTEGER,
        lab_id INTEGER,
        division_id INTEGER,
        hours INTEGER
    )
    """)

    # CONSTRAINTS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS constraints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        teacherMaxHours INTEGER,
        allowLabOnly INTEGER,
        maxSubjectsPerDay INTEGER
    )
    """)

    # TIMETABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS timetable (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        division TEXT,
        day TEXT,
        slot TEXT,
        teacher TEXT,
        subject TEXT,
        room TEXT,
        batch TEXT
    )
    """)

    conn.commit()
    conn.close()