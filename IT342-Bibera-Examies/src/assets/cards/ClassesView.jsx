import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClassesCard from "./ClassesCard";
import { useAuth } from "../../contexts/AuthContext";

const ClassesView = () => {

  const [classes, setClasses] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

    const fetchClasses = async () => {
      try {
        // 🔥 Get classes
        const res = await fetch(
          `http://localhost:8080/api/classes/instructor/${user.id}`
        );
        const data = await res.json();

        setClasses(data);

      } catch (error) {
        console.error(error);
      }
    };

    if (user) fetchClasses();

  }, [user]);

  return (
    <>
      {classes.map(c => (
        <ClassesCard
          key={c.id}
          classItem={{
            id: c.id,
            title: c.className,
            description: "Class",
            students: c.studentCount ?? 0,
            exams: c.examCount ?? 0,
            onViewStudents: () => navigate(`/analytics/${c.id}`)
          }}
        />
      ))}
    </>
  );
};

export default ClassesView;