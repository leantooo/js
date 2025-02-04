"use client"

import { ITask } from "@/domain/ITask";
import TaskService from "@/services/TaskService";
import { AppContext } from "@/state/AppContext";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { IPriority } from "@/domain/IPriority";
import { ICategory } from "@/domain/ICategory";
import CategoryService from "@/services/CategoryService";
import PriorityService from "@/services/PriorityService";
import { useRouter } from "next/navigation";
import formatDate from "@/components/utils";

export default function Tasks({}) {
    const { setUserInfo } = useContext(AppContext)!;
    const [isLoading, setIsLoading] = useState(true);
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [priorities, setPriorities] = useState<IPriority[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const storedUserInfo = localStorage.getItem('userInfo');
            if (!storedUserInfo) {
                router.push("/login");
                return;
            }

            const user = JSON.parse(storedUserInfo);
            setUserInfo(user);

            const tasksResponse = await TaskService.getAll(user.token);
            if (tasksResponse.data) {
                setTasks(tasksResponse.data);
            }

            const categoriesResponse = await CategoryService.getAll(user.token);
            if (categoriesResponse.data) {
                setCategories(categoriesResponse.data);
            }

            const prioritiesResponse = await PriorityService.getAll(user.token);
            if (prioritiesResponse.data) {
                setPriorities(prioritiesResponse.data);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [setUserInfo, router]);

    if (isLoading) return (<h1>Tasks - LOADING</h1>);

    return (
        <>
            <h1>Tasks</h1>

            <p>
                <Link className='create-button' href="/todo/tasks/create">Create New</Link>
            </p>
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            TaskName
                        </th>
                        <th>
                            TaskSort
                        </th>
                        <th>
                            CreatedAt
                        </th>
                        <th>
                            IsCompleted
                        </th>
                        <th>
                            IsArchived
                        </th>
                        <th>
                            Category
                        </th>
                        <th>
                            Priority
                        </th>
                        <th>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((item) =>
                        <tr key={item.id}>
                            <td>
                                {item.taskName}
                            </td>
                            <td>
                                {item.taskSort}
                            </td>
                            <td>
                                {formatDate(item.syncDt)}
                            </td>
                            <td>
                                {item.isCompleted ? '✅' : '❌'}
                            </td>
                            <td>
                                {item.isArchived ? '✅' : '❌'}
                            </td>
                            <td>
                                {categories.find(cat => cat.id === item.todoCategoryId)?.categoryName || 'Unknown'}
                            </td>
                            <td>
                                {priorities.find(pri => pri.id === item.todoPriorityId)?.priorityName || 'Unknown'}
                            </td>
                            <td>
                                <Link className='rud' href={`/todo/tasks/edit/${item.id}`}>Edit</Link> |
                                <Link className='rud' href={`/todo/tasks/details/${item.id}`}>Details</Link> |
                                <Link className='rud' href={`/todo/tasks/delete/${item.id}`}>Delete</Link>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}
