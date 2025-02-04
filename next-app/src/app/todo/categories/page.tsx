"use client"

import { ICategory } from "@/domain/ICategory";
import CategoryService from "@/services/CategoryService";
import { AppContext } from "@/state/AppContext";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Categories({}) {
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<ICategory[]>([]);
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

            const response = await CategoryService.getAll(user.token);
            if (response.data) {
                setCategories(response.data);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [setUserInfo, router]);

    if (isLoading) return (<h1>Categories - LOADING</h1>);

    return (
        <>
            <h1>Categories</h1>

            <p>
                <Link className="create-button" href="/todo/categories/create">Create New</Link>
            </p>
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            CategoryName
                        </th>
                        <th>
                            CategorySort
                        </th>
                        <th>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((item) =>
                        <tr key={item.id}>
                            <td>
                                {item.categoryName}
                            </td>
                            <td>    
                                {item.categorySort}
                            </td>
                            <td>
                                <Link href={`/todo/categories/edit/${item.id}`} className="rud">Edit</Link> 
                                <Link href={`/todo/categories/details/${item.id}`} className="rud">Details</Link> 
                                <Link href={`/todo/categories/delete/${item.id}`} className="rud">Delete</Link> 
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}
