"use client";

import { useRouter, useParams } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import CategoryService from "@/services/CategoryService";
import { ICategory } from "@/domain/ICategory";
import { AppContext } from "@/state/AppContext";

export default function EditCategoryPage() {
    const router = useRouter();
    const { id } = useParams();
    const { userInfo } = useContext(AppContext) || {};

    const [categoryName, setCategoryName] = useState("");
    const [categorySort, setCategorySort] = useState(0);

    useEffect(() => {
        const fetchCategory = async () => {
            if (userInfo && id) {
                try {
                    const response = await CategoryService.view(userInfo.token, id as string);
                    if (response.data) {
                        setCategoryName(response.data.categoryName);
                        setCategorySort(response.data.categorySort);
                    }
                } catch (error) {
                    console.error("Error fetching category details:", error);
                }
            }
        };

        fetchCategory();
    }, [id, userInfo]);

    const handleEditCategory = async () => {
        if (!userInfo || !userInfo.token) {
            console.error("User info or token is not available");
            return;
        }

        const updatedCategory: ICategory = {
            id: id as string,
            categoryName,
            categorySort,
            tag: "string",
            syncDt: new Date().toISOString(),
        };

        try {
            const response = await CategoryService.edit(userInfo.token, id as string, updatedCategory);
            if (response.data) {
                console.log("Category edited:", response.data);
                router.push("/todo/categories");
            }
        } catch (error) {
            console.error("Error editing category:", error);
        }
    };

    return (
        <div>
            <h1>Edit Category</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleEditCategory();
                }} style={{ display: "flex", flexDirection: "column", gap: "5px", maxWidth: "300px" }}>
            
                <label htmlFor="categoryName">Category Name:</label>
                <input
                    type="text"
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
                <label htmlFor="categorySort">Category Sort:</label>
                <input
                    type="number"
                    id="categorySort"
                    value={categorySort}
                    onChange={(e) => setCategorySort(parseInt(e.target.value))}
                />
                <div style={{ display: "flex", gap: "1em" }}>
                    <button type="submit" className="save-button">Save</button>
                    <button type="button" className='back-link' onClick={() => router.push("/todo/categories")}>No, back to categories</button>
                </div>
            </form>
        </div>
    );
}
