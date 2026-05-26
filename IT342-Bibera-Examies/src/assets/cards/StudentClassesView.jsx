import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import StudentClassesCard from "./StudentClassesCard";
import "../../assets/styles/StudentClassesCard.css";

const StudentClassesView = () => {

  const [classes, setClasses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) {
      setClasses([]);
      return;
    }

    const fetchClasses = async () => {
      try {
        // 🔥 Get classes
        const res = await fetch(
          `http://localhost:8080/api/classes/student/${user.id}`
        );

        const data = await res.json();

        // 🔥 DEBUG (VERY IMPORTANT)
        console.log("Fetched classes:", data);

        // Keep only valid class objects to avoid null/undefined crashes
        const normalized = Array.isArray(data)
          ? data
          : data
            ? [data]
            : [];

        const safeClasses = normalized.filter(
          (item) => item && typeof item === "object" && item.id != null
        );

        setClasses(safeClasses);

      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]);
      }
    };

    fetchClasses();

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