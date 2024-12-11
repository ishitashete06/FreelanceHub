import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";

function TaskTracking() {
    const [tasks, setTasks] = useState({ todo: [], doing: [], done: [] });
    const [newTask, setNewTask] = useState("");
    const userId = "12345"; // Replace with dynamic user ID when authentication is added

    // Fetch tasks on component load
    useEffect(() => {
        axios.get(`/api/tasks/${userId}`).then((response) => {
            setTasks(response.data.tasks || { todo: [], doing: [], done: [] });
        });
    }, []);

    const addTask = () => {
        if (newTask.trim()) {
            setTasks((prev) => ({ ...prev, todo: [...prev.todo, newTask] }));
            setNewTask("");
        }
    };

    const saveTasks = () => {
        axios.post(`/api/tasks/${userId}`, { tasks }).then(() => {
            //console.log("Tasks updated successfully!");
        });
    };

    const onDragStart = (e, task, from) => {
        e.dataTransfer.setData("task", task);
        e.dataTransfer.setData("from", from);
    };

    const onDrop = (e, to) => {
        const task = e.dataTransfer.getData("task");
        const from = e.dataTransfer.getData("from");

        if (task && from !== to) {
            setTasks((prev) => ({
                ...prev,
                [from]: prev[from].filter((t) => t !== task),
                [to]: [...prev[to], task],
            }));
        }
    };

    const allowDrop = (e) => e.preventDefault();

    return (
        <div>
            <Navbar />
            <div className="bg-[#f7efe5] min-h-screen">
                {/* Main Content */}
                <div className="p-6">
                    <header className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-[#674188]">Task Tracking</h1>
                        <p className="text-lg text-[#674188] mt-2">
                            Organize your tasks efficiently and stay on top of your work.
                        </p>
                    </header>

                    {/* Input and Add Task */}
                    <div className="flex justify-center mb-6">
                        <input
                            type="text"
                            placeholder="Add a new task..."
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            className="p-3 w-96 border border-[#c8a1e0] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#c8a1e0] text-[#674188] bg-white shadow-sm"
                        />
                        <button
                            onClick={addTask}
                            className="p-3 bg-[#674188] text-[#f7efe5] rounded-r-lg font-semibold hover:bg-[#5b3571] transition-shadow duration-300 shadow-sm"
                        >
                            Add Task
                        </button>
                    </div>

                    {/* Task Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {["todo", "doing", "done"].map((column) => (
                            <div
                                key={column}
                                className="p-5 rounded-lg shadow-lg bg-[#e2bfd9] border border-[#c8a1e0]"
                                onDragOver={allowDrop}
                                onDrop={(e) => {
                                    onDrop(e, column);
                                    saveTasks();
                                }}
                            >
                                <h2 className="text-2xl font-semibold text-center mb-4 text-[#674188]">
                                    {column.toUpperCase()}
                                </h2>
                                <div className="space-y-3">
                                    {tasks[column].map((task, index) => (
                                        <div
                                            key={index}
                                            className="p-4 border rounded-lg bg-[#f7efe5] border-[#c8a1e0] text-[#674188] font-medium shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-300"
                                            draggable
                                            onDragStart={(e) => onDragStart(e, task, column)}
                                        >
                                            {task}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskTracking;
