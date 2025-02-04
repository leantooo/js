"use client";

import { useRouter, useParams } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import TaskService from "@/services/TaskService";
import CategoryService from "@/services/CategoryService";
import PriorityService from "@/services/PriorityService";
import { ITask } from "@/domain/ITask";
import { AppContext } from "@/state/AppContext";
import { ICategory } from "@/domain/ICategory";
import { IPriority } from "@/domain/IPriority";
import Link from "next/link";


export default function EditTaskPage() {
    const router = useRouter();
    const { id } = useParams();
    const { userInfo } = useContext(AppContext) || {};

    const [taskName, setTaskName] = useState("");
    const [taskSort, setTaskSort] = useState(0);
    const [todoCategoryId, setTodoCategoryId] = useState("");
    const [todoPriorityId, setTodoPriorityId] = useState("");
    const [dueTo, setDueTo] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [isCompleted, setIsCompleted] = useState(false);
    const [isArchived, setIsArchived] = useState(false);

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [priorities, setPriorities] = useState<IPriority[]>([]);

    useEffect(() => {
        const fetchTask = async () => {
            if (userInfo && id) {
                try {
                    const response = await TaskService.view(userInfo.token, id as string);
                    if (response.data) {
                        setTaskName(response.data.taskName);
                        setTaskSort(response.data.taskSort);
                        setTodoCategoryId(response.data.todoCategoryId);
                        setTodoPriorityId(response.data.todoPriorityId);
                        setDueTo(response.data.dueTo);
                        setIsCompleted(response.data.isCompleted);
                        setIsArchived(response.data.isArchived);
                    }
                } catch (error) {
                    console.error("Error fetching task details:", error);
                }
            }
        };

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

        fetchTask();
        fetchCategoriesAndPriorities();
    }, [id, userInfo]);

    const handleEditTask = async () => {
        if (!userInfo || !userInfo.token) {
            console.error("User info or token is not available");
            return;
        }

        const updatedTask: ITask = {
            id: id as string,
            taskName,
            taskSort,
            dueTo: dueTo,
            isCompleted: isCompleted,
            isArchived: isArchived,
            todoCategoryId: todoCategoryId,
            todoPriorityId: todoPriorityId,
            syncDt: new Date().toISOString(),
        };

        try {
            const response = await TaskService.edit(userInfo.token, id as string, updatedTask);
            if (response.data) {
                console.log("Task edited:", response.data);
                router.push("/todo/tasks");
            }
        } catch (error) {
            console.error("Error editing task:", error);
        }
    };

    return (
        <div>
            <h1>Edit Task</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleEditTask();
                }}
                style={{ display: "flex", flexDirection: "column", gap: "5px", maxWidth: "300px" }}
            >
                <label htmlFor="taskName">Task Name:</label>
                <input
                    type="text"
                    id="taskName"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                />
                <label htmlFor="taskSort">Task Sort:</label>
                <input
                    type="number"
                    id="taskSort"
                    value={taskSort}
                    onChange={(e) => setTaskSort(parseInt(e.target.value))}
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
                >
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
                >
                    {priorities.map(priority => (
                        <option key={priority.id} value={priority.id}>
                            {priority.priorityName}
                        </option>
                    ))}
                </select>
                <div style={{ display: "flex", gap: "1em" }}>
                    <button className='save-button' type="submit">Save</button>
                    <Link className='back-link' href="/todo/tasks">No, back to tasks</Link>
                </div>
            </form>
        </div>
    );
}
