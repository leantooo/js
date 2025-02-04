"use client";

import CategoryService from "@/services/CategoryService";
import { ICategory } from "@/domain/ICategory";
import { AppContext } from "@/state/AppContext";
import { useContext, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import formatDate from "@/components/utils";

export default function DetailsCategoryPage() {
    const { id } = useParams();
    const [category, setCategory] = useState<ICategory | null>(null);
    const { userInfo } = useContext(AppContext)!;

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await CategoryService.view(userInfo!.token, id as string);
                if (response.data) {
                    setCategory(response.data);
                } else {
                    console.error("Error fetching category details:", response.errors);
                }
            } catch (error) {
                console.error("Error fetching category details:", error);
            }
        };

        fetchCategory();
    }, [id, userInfo]);

    if (!category) return <h1>Loading...</h1>;

    return (
        
        <div className="bg-white shadow-md rounded-md p-4">
            <h1>Category Details</h1>
            <p className="text-sm font-medium text-gray-600">
                Category Name:&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="ml-4 text-gray-900">{category.categoryName}</span>
            </p>
            <p className="text-sm font-medium text-gray-600">
                Category Sort:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="ml-4 text-gray-900">{category.categorySort}</span>
            </p>
            <p className="text-sm font-medium text-gray-600">
                Category Date:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="ml-4 text-gray-900">{formatDate(category.syncDt)}</span>
            </p>
            <div style={{ display: "flex", gap: "1em" }}>
                <Link className='edit-button' href={`/todo/categories/edit/${id}`}>Edit</Link>
                <Link className='back-link' href="/todo/categories">No, back to categories</Link>
            </div>
        </div>
    );
}
