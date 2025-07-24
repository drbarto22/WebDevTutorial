import CreateTask from "./components/CreateTask";
import EditTask from "./components/EditTask";
import TaskList from "./components/taskList";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/create" element={<CreateTask />} />
        <Route path="/edit/:id" element={<EditTask />} />
      </Routes>
    </>
  );
}

export default App;
