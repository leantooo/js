"use client";

import { useRouter, useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/state/AppContext";
import CategoryService from "@/services/CategoryService";
import { ICategory } from "@/domain/ICategory";
import formatDate from "@/components/utils";

export default function DeleteCategoryPage() {
    const router = useRouter();
    const { id } = useParams();
    const [category, setCategory] = useState<ICategory | null>(null);
    const { userInfo } = useContext(AppContext)!;
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategory = async () => {
            if (userInfo && id) {
                try {
                    const response = await CategoryService.view(userInfo.token, id as string);
                    if (response.data) {
                        setCategory(response.data);
                    } else {
                        setError(response.errors?.[0] || "Error fetching category details.");
                    }
                } catch (error: unknown) {
                    setError(error instanceof Error ? error.message : "Error fetching category details.");
                }
            }
        };

        fetchCategory();
    }, [id, userInfo]);

    const handleDeleteCategory = async () => {
        try {
            if (!userInfo || !userInfo.token) {
                setError("User info or token is not available");
                return;
            }

            const response = await CategoryService.delete(userInfo.token, id as string);
            if (response.data === null) {
                console.log("Category deleted successfully");
                router.push("/todo/categories");
            } else {
                setError(response.errors?.[0] || "Error deleting category.");
            }
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Error deleting category.");
        }
    };

    if (!category) return <h1>Loading...</h1>;

    return (
        <div>
            <h1>Delete Category</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p><h5>Are you sure you want to delete this category?</h5></p>
            <p>Name: {category.categoryName}</p>
            <p>Sort: {category.categorySort}</p>
            <p>Sync Date: {formatDate(category.syncDt)}</p>
            <button className='delete-button' onClick={handleDeleteCategory}>Yes, delete</button>
            <button className='back-link'onClick={() => router.push("/todo/categories")}>No, back to categories</button>
        </div>
    );
}
