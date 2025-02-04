"use client";

import { useRouter, useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/state/AppContext";
import PriorityService from "@/services/PriorityService";
import { IPriority } from "@/domain/IPriority";
import formatDate from "@/components/utils";
import Link from "next/link";

export default function DeletePriorityPage() {
    const router = useRouter();
    const { id } = useParams();
    const [priority, setPriority] = useState<IPriority | null>(null);
    const { userInfo } = useContext(AppContext)!;
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPriority = async () => {
            if (userInfo && id) {
                try {
                    const response = await PriorityService.view(userInfo.token, id as string);
                    if (response.data) {
                        setPriority(response.data);
                    } else {
                        setError(response.errors?.[0] || "Error fetching Priority details.");
                    }
                } catch (error: unknown) {
                    setError(error instanceof Error ? error.message : "Error fetching Priority details.");
                }
            }
        };

        fetchPriority();
    }, [id, userInfo]);

    const handleDeletePriority = async () => {
        try {
            if (!userInfo || !userInfo.token) {
                setError("User info or token is not available");
                return;
            }

            const response = await PriorityService.delete(userInfo.token, id as string);
            if (response.data === null) {
                console.log("Priority deleted successfully");
                router.push("/todo/priorities");
            } else {
                setError(response.errors?.[0] || "Error deleting priority.");
            }
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Error deleting priority.");
        }
    };

    if (!priority) return <h1>Loading...</h1>;

    return (
        <div>
            <h1>Delete Priority</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p><h5>Are you sure you want to delete this Priority?</h5></p>
            <p>Name: {priority.priorityName}</p>
            <p>Sort: {priority.prioritySort}</p>
            <p>Sync Date: {formatDate(priority.syncDt)}</p>
            <button className='delete-button' onClick={handleDeletePriority}>Yes, delete</button>
            <Link className='back-link' href="/todo/priorities">No, back to priorities</Link>

        </div>
    );
}
