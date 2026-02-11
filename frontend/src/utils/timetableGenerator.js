export const generateTimetable = (subjects) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const periods = 5;

  let timetable = {};

  days.forEach(day => {
    timetable[day] = [];

    for (let i = 0; i < periods; i++) {
      const subject = subjects[i % subjects.length];
      timetable[day].push(subject?.name || "Free");
    }
  });

  return timetable;
};