import React, { useEffect, useState } from "react";
import ClassesCard from "./ClassesCard";
import { useAuth } from "../../contexts/AuthContext";

const ClassesView = () => {

  const [classes, setClasses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {

    const fetchClasses = async () => {
      try {
        // 🔥 Get teacher info
        const userRes = await fetch(
          `http://localhost:8080/api/auth/me?email=${user.email}`
        );
        const userData = await userRes.json();

        // 🔥 Get classes
        const res = await fetch(
          `http://localhost:8080/api/classes/instructor/${userData.id}`
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
            title: c.className,
            description: "Class",
            students: 0,
            exams: 0
          }}
        />
      ))}
    </>
  );
};

export default ClassesView;