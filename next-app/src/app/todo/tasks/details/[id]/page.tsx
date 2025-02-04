"use client";

import TaskService from "@/services/TaskService";
import { ITask } from "@/domain/ITask";
import { AppContext } from "@/state/AppContext";
import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ICategory } from "@/domain/ICategory";
import { IPriority } from "@/domain/IPriority";
import CategoryService from "@/services/CategoryService";
import PriorityService from "@/services/PriorityService";
import formatDate from "@/components/utils";

export default function DetailsTaskPage() {
    const { id } = useParams();
    const [task, setTask] = useState<ITask | null>(null);
    const { userInfo } = useContext(AppContext)!;
    
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [priorities, setPriorities] = useState<IPriority[]>([]);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await TaskService.view(userInfo!.token, id as string);
                if (response.data) {
                    setTask(response.data);
                } else {
                    console.error("Error fetching task details:", response.errors);
                }
            } catch (error) {
                console.error("Error fetching task details:", error);
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

    if (!task) return <h1>Loading...</h1>;

    const category = categories.find(cat => cat.id === task.todoCategoryId);
    const categoryName = category ? category.categoryName : "Unknown";

    const priority = priorities.find(pri => pri.id === task.todoPriorityId);
    const priorityName = priority ? priority.priorityName : "Unknown";
    
    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <h1>Task Deatails</h1>
            <p>Name: {task.taskName}</p>
            <p>Sort: {task.taskSort}</p>
            <p>CreatedAt: {formatDate(task.syncDt)}</p>
            <p>IsCompleted: {task.isCompleted ? '✅' : '❌'}</p>
            <p>IsArchived: {task.isArchived ? '✅' : '❌'}</p>
            <p>Category: {categoryName}</p>
            <p>Priority: {priorityName}</p>
            <Link className='edit-button' href={`/todo/tasks/edit/${id}`}>Edit</Link>
            <Link className='back-link' href="/todo/tasks">No, back to tasks</Link>
        </div>
    );
}
