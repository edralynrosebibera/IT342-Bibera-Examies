import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import StudentClassesCard from "./StudentClassesCard";
import "../../assets/styles/StudentClassesCard.css";

const StudentClassesView = () => {

  const [classes, setClasses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {

    const fetchClasses = async () => {
      try {
        // 🔥 Get logged-in user
        const userRes = await fetch(
          `http://localhost:8080/api/auth/me?email=${user.email}`
        );
        const userData = await userRes.json();

        // 🔥 Get classes
        const res = await fetch(
          `http://localhost:8080/api/classes/student/${userData.id}`
        );

        const data = await res.json();

        // 🔥 DEBUG (VERY IMPORTANT)
        console.log("Fetched classes:", data);

        // 🔥 FIX: Ensure it's always an array
        if (Array.isArray(data)) {
          setClasses(data);
        } else if (data) {
          setClasses([data]); // convert single object to array
        } else {
          setClasses([]);
        }

      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]);
      }
    };

    if (user) fetchClasses();

  }, [user]);

  return (
    <div className="exams-display-grid">

      {/* 🔥 SAFE RENDER */}
      {Array.isArray(classes) && classes.length > 0 ? (
        classes.map(c => (
          <StudentClassesCard key={c.id} classItem={c} />
        ))
      ) : (
        <p>No classes found</p>
      )}

    </div>
  );
};

export default StudentClassesView;