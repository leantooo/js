"use client";

import { useRouter, useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/state/AppContext";
import TaskService from "@/services/TaskService";
import { ITask } from "@/domain/ITask";
import Link from "next/link";
import CategoryService from "@/services/CategoryService";
import PriorityService from "@/services/PriorityService";
import { ICategory } from "@/domain/ICategory";
import { IPriority } from "@/domain/IPriority";
import formatDate from "@/components/utils";

export default function DeleteTaskPage() {
    const router = useRouter();
    const { id } = useParams();
    const [task, setTask] = useState<ITask | null>(null);
    const { userInfo } = useContext(AppContext)!;
    const [error, setError] = useState<string | null>(null);

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [priorities, setPriorities] = useState<IPriority[]>([]);

    useEffect(() => {
        const fetchTask = async () => {
            if (userInfo && id) {
                try {
                    const response = await TaskService.view(userInfo.token, id as string);
                    if (response.data) {
                        setTask(response.data);
                    } else {
                        setError(response.errors?.[0] || "Error fetching task details.");
                    }
                } catch (error: unknown) {
                    setError(error instanceof Error ? error.message : "Error fetching task details.");
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

    const handleDeleteTask = async () => {
        try {
            if (!userInfo || !userInfo.token) {
                setError("User info or token is not available");
                return;
            }

            const response = await TaskService.delete(userInfo.token, id as string);
            if (response.data === null) {
                console.log("Task deleted successfully");
                router.push("/todo/tasks");
            } else {
                setError(response.errors?.[0] || "Error deleting task.");
            }
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Error deleting task.");
        }
    };

    if (!task) return <h1>Loading...</h1>;

    const category = categories.find(cat => cat.id === task.todoCategoryId);
    const categoryName = category ? category.categoryName : "Unknown";

    const priority = priorities.find(pri => pri.id === task.todoPriorityId);
    const priorityName = priority ? priority.priorityName : "Unknown";

    if (!task) return <h1>Loading...</h1>;

    return (
        <div>
            <h1>Delete Task</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p><h5>Are you sure you want to delete this task?</h5></p>
            <p>Name: {task.taskName}</p>
            <p>Sort: {task.taskSort}</p>
            <p>CreatedAt: {formatDate(task.syncDt)}</p>
            <p>IsCompleted: {task.isCompleted ? '✅' : '❌'}</p>
            <p>IsArchived: {task.isArchived ? '✅' : '❌'}</p>
            <p>Category: {categoryName}</p>
            <p>Priority: {priorityName}</p>
            <button className='delete-button' onClick={handleDeleteTask}>Yes, delete</button>
            <Link className='back-link' href="/todo/tasks">No, back to tasks</Link>
        </div>
    );
}
