import { useState } from "react";
import type { FormEvent } from "react";
import axios, { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

interface TaskData {
  task: string;
  status: boolean;
  created: Date;
}

interface ApiResponse {
  data: TaskData;
  message?: string;
  success: boolean;
}

export default function CreateTask() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TaskData>({
    task: "",
    status: false,
    created: new Date(),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post<TaskData, AxiosResponse<ApiResponse>>(
        "http://localhost:8000/api/todos",
        {
          ...formData,
          date: formData.created.toISOString(),
        }
      );

      console.log("Success:", response.data);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="task" className="mb-1 font-medium">
            Task Name:
          </label>
          <input
            type="text"
            name="task"
            id="task"
            value={formData.task}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="status"
            id="status"
            checked={formData.status}
            onChange={handleChange}
            className="mr-2 h-5 w-5"
          />
          <label htmlFor="status">Completed</label>
        </div>

        <button
          type="submit" // Changed to type="submit" for proper form handling
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}
