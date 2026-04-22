import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [courses, setCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  // 📘 Fetch Courses
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/courses")
      .then(res => setCourses(res.data))
      .catch(err => console.log(err));
  }, []);

  // 📅 Fetch Schedule
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/schedule")
      .then(res => setSchedule(res.data))
      .catch(err => console.log(err));
  }, []);

  // 📩 Submit Contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/contact", form);
      alert("Message Sent Successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      alert("Error sending message");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>

      <h1>🎓 Coaching Website</h1>

      {/* 📘 Courses */}
      <h2>Courses</h2>
      {courses.length === 0 ? <p>Loading...</p> :
        courses.map((c, i) => (
          <div key={i} style={{ border: "1px solid gray", margin: "10px", padding: "10px", borderRadius: "8px" }}>
            <h3>{c.Title}</h3>
            <p>💰 Price: ₹{c.Price}</p>
            <p>⏳ Duration: {c.Duration}</p>
          </div>
        ))
      }

      {/* 📅 Schedule */}
      <h2>Schedule</h2>
      {schedule.length === 0 ? <p>Loading...</p> :
        schedule.map((s, i) => (
          <div key={i} style={{ border: "1px solid blue", margin: "10px", padding: "10px", borderRadius: "8px" }}>
            <h3>{s.Course}</h3>
            <p>🕒 Time: {s.Time}</p>
            <a href={s.MeetLink} target="_blank" rel="noreferrer">
              🔗 Join Class
            </a>
          </div>
        ))
      }

      {/* 📩 Contact */}
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        /><br /><br />

        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        /><br /><br />

        <textarea
          placeholder="Message"
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
        /><br /><br />

        <button type="submit">Send</button>
      </form>

    </div>
  );
}

export default App;