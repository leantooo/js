"use client";

import TaskService from "@/services/TaskService";
import CategoryService from "@/services/CategoryService";
import PriorityService from "@/services/PriorityService";
import { ITask } from "@/domain/ITask";
import { AppContext } from "@/state/AppContext";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ICategory } from "@/domain/ICategory";
import { IPriority } from "@/domain/IPriority";
import Link from "next/link";

export default function CreateTaskPage() {
    const router = useRouter();
    const [taskName, setTaskName] = useState("");
    const [taskSort, setTaskSort] = useState<number | undefined>(undefined);
    const [dueTo, setDueTo] = useState("");
    const [isCompleted, setIsCompleted] = useState(false);
    const [isArchived, setIsArchived] = useState(false);
    const [todoCategoryId, setTodoCategoryId] = useState("");
    const [todoPriorityId, setTodoPriorityId] = useState("");
    const { userInfo } = useContext(AppContext)!;
    
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [priorities, setPriorities] = useState<IPriority[]>([]);

    useEffect(() => {
        const fetchCategoriesAndPriorities = async () => {
            if (userInfo) {
                try {
                    const categoriesResponse = await CategoryService.getAll(userInfo.token);
                    const prioritiesResponse = await PriorityService.getAll(userInfo.token);

                    if (categoriesResponse.data) {
                        setCategories(categoriesResponse.data);
                    }
                    if (prioritiesResponse.data) {
                        setPriorities(prioritiesResponse.data);
                    }
                } catch (error) {
                    console.error("Error fetching categories or priorities:", error);
                }
            }
        };

        fetchCategoriesAndPriorities();
    }, [userInfo]);

    const handleCreateTask = async () => {
        try {
            const newTask: Partial<ITask> = {
                taskName: taskName,
                taskSort: taskSort,
                dueTo: dueTo,
                isCompleted: isCompleted,
                isArchived: isArchived,
                todoCategoryId: todoCategoryId,
                todoPriorityId: todoPriorityId,
                syncDt: new Date().toISOString(),
            };
            const response = await TaskService.add(userInfo!.token, newTask);
            if (response.data) {
                console.log("Task created:", response.data);
                setTaskName("");
                setTaskSort(0);
                setDueTo("");
                setIsCompleted(false);
                setIsArchived(false);
                setTodoCategoryId("");
                setTodoPriorityId("");
                router.push("/todo/tasks");
            } else {
                console.error("Error creating Task:", response.errors);
            }
        } catch (error) {
            console.error("Error creating Task:", error);
        }
    };

    return (
        <div>
            <h1>Create Task</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateTask();
            }} style={{ display: "flex", flexDirection: "column", gap: "5px", maxWidth: "300px" }}>
                <label htmlFor="taskName">Task Name:</label>
                <input 
                    type="text" 
                    id="taskName" 
                    value={taskName} 
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Enter task name"
                    required
                />
                <label htmlFor="taskSort">Task Sort:</label>
                <input 
                    type="number" 
                    id="taskSort" 
                    value={taskSort} 
                    onChange={(e) => setTaskSort(parseInt(e.target.value))}
                    placeholder="Enter task sort"
                    required
                />
                <label htmlFor="dueTo">Due To:</label>
                <input 
                    type="date" 
                    id="dueTo" 
                    value={dueTo} 
                    onChange={(e) => setDueTo(e.target.value)} 
                />
                <label htmlFor="isCompleted">Is Completed:</label>
                <input 
                    type="checkbox" 
                    id="isCompleted" 
                    checked={isCompleted} 
                    onChange={(e) => setIsCompleted(e.target.checked)} 
                />
                <label htmlFor="isArchived">Is Archived:</label>
                <input 
                    type="checkbox" 
                    id="isArchived" 
                    checked={isArchived} 
                    onChange={(e) => setIsArchived(e.target.checked)} 
                />
                <label htmlFor="todoCategoryId">Category:</label>
                <select
                    id="todoCategoryId"
                    value={todoCategoryId}
                    onChange={(e) => setTodoCategoryId(e.target.value)}
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.categoryName}
                        </option>
                    ))}
                </select>
                <label htmlFor="todoPriorityId">Priority:</label>
                <select
                    id="todoPriorityId"
                    value={todoPriorityId}
                    onChange={(e) => setTodoPriorityId(e.target.value)}
                    required
                >
                    <option value="">Select Priority</option>
                    {priorities.map(priority => (
                        <option key={priority.id} value={priority.id}>
                            {priority.priorityName}
                        </option>
                    ))}
                </select>
                <div style={{ display: "flex", gap: "1em" }}>
                    <button className='create-button' type="submit">Create</button>
                    <Link className='back-link' href="/todo/tasks">No, back to tasks</Link>
                </div>
            </form>
        </div>
    );
    
}
