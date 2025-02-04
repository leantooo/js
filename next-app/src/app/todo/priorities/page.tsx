"use client"

import { IPriority } from "@/domain/IPriority";
import PriorityService from "@/services/PriorityService";
import { AppContext } from "@/state/AppContext";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Priorities({}) {
    const [isLoading, setIsLoading] = useState(true);
    const [priorities, setPriorities] = useState<IPriority[]>([]);
    const { userInfo, setUserInfo } = useContext(AppContext)!;
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

            const response = await PriorityService.getAll(user.token);
            if (response.data) {
                setPriorities(response.data);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [setUserInfo, router]);

    if (isLoading) return (<h1>Priorities - LOADING</h1>);

    return (
        <>
            <h1>Priorities</h1>

            <p>
                <Link className='create-button' href="/todo/priorities/create">Create New</Link>
            </p>
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            PriorityName
                        </th>
                        <th>
                            PrioritySort
                        </th>
                        <th>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {priorities.map((item) =>
                        <tr key={item.id}>
                            <td>
                                {item.priorityName}
                            </td>
                            <td>    
                                {item.prioritySort}
                            </td>
                            <td>
                                <Link className='rud' href={`/todo/priorities/edit/${item.id}`}>Edit</Link>
                                <Link className='rud' href={`/todo/priorities/details/${item.id}`}>Details</Link>
                                <Link className='rud' href={`/todo/priorities/delete/${item.id}`}>Delete</Link>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}
