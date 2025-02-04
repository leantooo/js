"use client"

import CategoryService from "@/services/CategoryService";
import { ICategory } from "@/domain/ICategory";
import { AppContext } from "@/state/AppContext";
import { useContext, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function CreateCategoryPage() {
    const router = useRouter();
    const [categoryName, setCategoryName] = useState("");
    const [categorySort, setCategorySort] = useState<number | undefined>(undefined);
    const { userInfo, setUserInfo } = useContext(AppContext)!;

    const handleCreateCategory = async () => {
        try {
            const newCategory: Partial<ICategory> = {
                categoryName: categoryName,
                categorySort: categorySort,
                syncDt: new Date().toISOString(),
            };
            const response = await CategoryService.add(userInfo!.token, newCategory);
            if (response.data) {
                console.log("Category created:", response.data);
                setCategoryName("");
                setCategorySort(0);
                router.push("/todo/categories");

            } else {
                console.error("Error creating category:", response.errors);
            }
        } catch (error) {
            console.error("Error creating category:", error);
        }
    };

    return (
        <div>
            <h1>Create Category</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateCategory();
            }} style={{ display: "flex", flexDirection: "column", gap: "5px", maxWidth: "300px" }}>
                <label htmlFor="categoryName">Category Name:</label>
                <input 
                    type="text" 
                    id="categoryName" 
                    value={categoryName} 
                    onChange={(e) => setCategoryName(e.target.value)} 
                    placeholder="Enter category name"
                    required
                />
                <label htmlFor="categorySort">Category Sort:</label>
                <input 
                    type="number" 
                    id="categorySort" 
                    value={categorySort} 
                    onChange={(e) => setCategorySort(parseInt(e.target.value))}
                    placeholder="Enter category sort"
                    required
                />
                <div style={{ display: "flex", gap: "1em" }}>
                    <button 
                        type="submit"
                        className="create-button"
                    >
                        Create
                    </button>
                    <Link href={"/todo/categories"} className="back-link">
                        No, back to categories
                    </Link>
                </div>
            </form>
        </div>
    );
}
