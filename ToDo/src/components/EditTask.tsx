import { Link, useNavigate, useParams } from "react-router-dom";
import axios, { type AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

export default function EditTask() {
  const navigate = useNavigate();

  interface RouteParam {
    id: string;
  }

  interface Task {
    id: number;
    task: string;
    created: Date;
    status: boolean;
  }

  interface ApiResponse {
    data: TaskData;
    message?: string;
    success: boolean;
  }

  const { id } = useParams<RouteParam>();
  const [formData, setFormData] = useState<Task>();

  console.log("Edit Page");
  async function getTask(id: string): Promise<Task> {
    try {
      const response: AxiosResponse<Task> = await axios.get(
        `http://localhost:8000/api/todos/${id}`
      );
      setFormData(response.data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log("Error fetch task:", error);
      throw error;
    }
  }
  useEffect(() => {
    getTask(id)
      .then((data) => {
        setFormData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleClick = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.patch<Task, AxiosResponse<ApiResponse>>(
        `http://localhost:8000/api/todos/${id}`,
        {
          ...formData,
        }
      );
      navigate("/");
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error("Server responded with error:", axiosError.response.data);
      } else if (axiosError.request) {
        console.error("No response received:", axiosError.request);
      } else {
        console.error("Request setup error:", axiosError.message);
      }
    }
  };

  return (
    <>
      {formData ? (
        <form action="">
          <div>
            <label htmlFor="task">Task Name:</label>
            <input
              type="text"
              id="task"
              name="task"
              defaultValue={formData.task}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="status">Completed</label>
            <input
              type="checkbox"
              name="status"
              id="status"
              checked={formData.status}
              onChange={handleChange}
            />
          </div>
          <div>
            <button
              onClick={handleClick}
              className="bg-blue-600 px-2 py-1 text-sm rounded-md text-white mr-3 cursor-pointer"
            >
              Submit Changes
            </button>
            <button className="bg-red-500 px-2 py-1 text-sm text-white rounded-md">
              <Link to={"/"}>Quit</Link>
            </button>
          </div>
        </form>
      ) : (
        "loading"
      )}
    </>
  );
}
