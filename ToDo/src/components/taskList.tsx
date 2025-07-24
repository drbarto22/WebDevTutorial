import axios from "axios";
import type { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface Tasks {
  id?: number;
  task: string;
  created: Date;
  status: boolean;
}

interface TaskData {
  task: string;
  status: boolean;
}

async function getTasks(): Promise<Tasks[]> {
  try {
    const response: AxiosResponse<Tasks[]> = await axios.get(
      "http://localhost:8000/api/todos/all"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
}

async function DeleteTasks(id: Tasks["id"]) {
  try {
    const response: AxiosResponse<string> = await axios.delete(
      `http://localhost:8000/api/todos/${id}`
    );
    window.location.reload();
    console.log(`Succesfully deleted item ${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export default function TaskList() {
  const DeleteTask = (key: task.id) => {
    DeleteTasks(key);
    // console.log(key);
  };

  const [tasks, setTasks] = useState<Tasks[]>([]);

  useEffect(() => {
    getTasks()
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="max-w-800">
        <table className="">
          <thead>
            <tr className="bg-gray-200">
              <td className="p-2">Task</td>
              <td className="p-2">Status</td>
              <td className="p-2">Date Created</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b text-sm">
                <td className="p-2">{task.task}</td>
                <td className="p-2">{task.status ? "✅" : "❌"}</td>
                <td className="p-2">
                  {new Date(task.created).toLocaleDateString()}
                </td>
                <td>
                  <button className="bg-yellow-400 px-2 py-1 rounded-md mr-2 text-xs">
                    <Link to={`/edit/${task.id}`}>Edit</Link>
                  </button>
                  <button
                    className="bg-red-400 px-2 py-1 rounded-md cursor-pointer text-xs"
                    onClick={() => DeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/create">
          <button className="mt-5 bg-blue-600 text-white px-2 py-1 rounded-sm">
            Create New
          </button>
        </Link>
      </div>
    </>
  );
}
