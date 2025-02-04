"use client";

import PriorityService from "@/services/PriorityService";
import { IPriority } from "@/domain/IPriority";
import { AppContext } from "@/state/AppContext";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreatePriorityPage() {
    const router = useRouter();
    const [priorityName, setPriorityName] = useState("");
    const [prioritySort, setPrioritySort] = useState<number | undefined>(undefined);
    const { userInfo, setUserInfo } = useContext(AppContext)!;

    const handleCreatePriority = async () => {
        try {
            const newPriority: Partial<IPriority> = {
                priorityName: priorityName,
                prioritySort: prioritySort,
                syncDt: new Date().toISOString(),
            };
            const response = await PriorityService.add(userInfo!.token, newPriority);
            if (response.data) {
                console.log("Priority created:", response.data);
                setPriorityName("");
                setPrioritySort(0);
                router.push("/todo/priorities");
            } else {
                console.error("Error creating priority:", response.errors);
            }
        } catch (error) {
            console.error("Error creating priority:", error);
        }
    };

    return (
        <div>
            <h1>Create Priority</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleCreatePriority();
            }} style={{ display: "flex", flexDirection: "column", gap: "5px", maxWidth: "300px" }}>
                <label htmlFor="priorityName">Priority Name:</label>
                <input 
                    type="text" 
                    id="priorityName" 
                    value={priorityName} 
                    onChange={(e) => setPriorityName(e.target.value)}
                    placeholder="Enter priority name"
                    required
                />
                <label htmlFor="prioritySort">Priority Sort:</label>
                <input 
                    type="number" 
                    id="prioritySort" 
                    value={prioritySort} 
                    onChange={(e) => setPrioritySort(parseInt(e.target.value))}
                    placeholder="Enter priority sort"
                    required
                />
                <div style={{ display: "flex", gap: "1em" }}>
                    <button className='create-button' type="submit">Create</button>
                    <Link className='back-link' href="/todo/priorities">No, back to priorities</Link>
                </div>
            </form>
        </div>
    );
}
