"use client";

import { useRouter, useParams } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import PriorityService from "@/services/PriorityService";
import { IPriority } from "@/domain/IPriority";
import { AppContext } from "@/state/AppContext";
import Link from "next/link";

export default function EditPriorityPage() {
    const router = useRouter();
    const { id } = useParams();
    const { userInfo } = useContext(AppContext) || {};

    const [priorityName, setPriorityName] = useState("");
    const [prioritySort, setPrioritySort] = useState(0);

    useEffect(() => {
        const fetchPriority = async () => {
            if (userInfo && id) {
                try {
                    const response = await PriorityService.view(userInfo.token, id as string);
                    if (response.data) {
                        setPriorityName(response.data.priorityName);
                        setPrioritySort(response.data.prioritySort);
                    }
                } catch (error) {
                    console.error("Error fetching Priority details:", error);
                }
            }
        };

        fetchPriority();
    }, [id, userInfo]);

    const handleEditPriority = async () => {
        if (!userInfo || !userInfo.token) {
            console.error("User info or token is not available");
            return;
        }

        const updatedPriority: IPriority = {
            id: id as string,
            priorityName,
            prioritySort,
            tag: "string",
            syncDt: new Date().toISOString(),
        };

        try {
            const response = await PriorityService.edit(userInfo.token, id as string, updatedPriority);
            if (response.data) {
                console.log("Priority edited:", response.data);
                router.push("/todo/priorities");
            }
        } catch (error) {
            console.error("Error editing Priority:", error);
        }
    };

    return (
        <div>
            <h1>Edit Priority</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleEditPriority();
                }} style={{ display: "flex", flexDirection: "column", gap: "5px", maxWidth: "300px" }}>
                <label htmlFor="priorityName">Priority Name:</label>
                <input
                    type="text"
                    id="priorityName"
                    value={priorityName}
                    onChange={(e) => setPriorityName(e.target.value)}
                    required
                />
                <label htmlFor="PrioritySort">Priority Sort:</label>
                <input
                    type="number"
                    id="PrioritySort"
                    value={prioritySort}
                    onChange={(e) => setPrioritySort(parseInt(e.target.value))}
                    required
                />
                <div style={{ display: "flex", gap: "1em" }}>
                    <button className='save-button' type="submit">Save</button>
                    <Link className='back-link' href="/todo/priorities">No, back to priorities</Link>
                </div>
            </form>
        </div>
    );
}
