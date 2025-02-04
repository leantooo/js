"use client";

import PriorityService from "@/services/PriorityService";
import { IPriority } from "@/domain/IPriority";
import { AppContext } from "@/state/AppContext";
import { useContext, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function DetailsPriorityPage() {
    const router = useRouter();
    const { id } = useParams();
    const [priority, setPriority] = useState<IPriority | null>(null);
    const { userInfo } = useContext(AppContext)!;

    useEffect(() => {
        const fetchPriority = async () => {
            try {
                const response = await PriorityService.view(userInfo!.token, id as string);
                if (response.data) {
                    setPriority(response.data);
                } else {
                    console.error("Error fetching Priority details:", response.errors);
                }
            } catch (error) {
                console.error("Error fetching Priority details:", error);
            }
        };

        fetchPriority();
    }, [id, userInfo]);

    if (!priority) return <h1>Loading...</h1>;

    return (
        
        <div className="bg-white shadow-md rounded-md p-4">
            <h1>Edit Priority</h1>
            <p className="text-sm font-medium text-gray-600">
                Priority Name:&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="ml-4 text-gray-900">{priority.priorityName}</span>
            </p>
            <p className="text-sm font-medium text-gray-600">
                Priority Sort:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="ml-4 text-gray-900">{priority.prioritySort}</span>
            </p>
            <p className="text-sm font-medium text-gray-600">
                Priority Date:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="ml-4 text-gray-900">{priority.syncDt}</span>
            </p>
            <div style={{ display: "flex", gap: "1em" }}>
                <Link className='edit-button' href={`/todo/priorities/edit/${id}`}>Edit</Link>
                <Link className='back-link' href="/todo/priorities">No, back to priorities</Link>
            </div>
        </div>
    );
}
