import axios, { AxiosError } from "axios";
import { IResultObject } from "../domain/IResultObject";
import { ICategory } from "@/domain/ICategory";
import AccountService from "./AccountService";

export default class CategoryService {
    private constructor() {}

    private static httpClient = axios.create({
        baseURL: 'https://taltech.akaver.com/api/v1/TodoCategories/',
    });

    static async initializeInterceptor() {
        this.httpClient.interceptors.request.use(async (config) => {
            const jwt = localStorage.getItem('jwt'); 
            if (jwt !== null && AccountService.checkTokenExpiration(jwt)) {
                config.headers.Authorization = `Bearer ${jwt}`;
            } else {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken !== null) {
                    try {
                        const response = await AccountService.refreshToken(jwt!, refreshToken);
                        if (response.data && response.data.token) {
                            const newJwt = response.data.token;
                            config.headers.Authorization = `Bearer ${newJwt}`;
                            localStorage.setItem('jwt', newJwt); 
                        } else {
                            console.error("Error updating token:", response.errors);
                        }
                    } catch (error) {
                        console.error("Error updating token:", error);
                    }
                } else {
                    console.error("Refresh token not found");
                }
            }
            return config;
        }, (error: AxiosError) => {
            return Promise.reject(error);
        });
    }

    static async getAll(jwt: string): Promise<IResultObject<ICategory[]>>{
        try {
            const response = await CategoryService.httpClient.get<ICategory[]>("", {
                headers: {
                    "Authorization": "Bearer " + jwt
                }
            });

            if (response.status < 300) {
                return {
                    data: response.data
                }
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            }
        } catch (error: any) {
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static async get(jwt: string, id: string): Promise<IResultObject<ICategory>> {
        try {

            console.log("Deleting category with ID:", id);
            
            const response = await this.httpClient.get<ICategory>(`${id}`, {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            });
            
            console.log("Delete category response:", response);
            
            if (response.status < 300) {
                return {
                    data: response.data
                }
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            }
        } catch (error: any) {
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static async add(jwt: string, category: Partial<ICategory>): Promise<IResultObject<ICategory>> {
        try {
            console.log("Adding new category:", category);
            const response = await CategoryService.httpClient.post<ICategory>("", category, {
                headers: {
                    "Authorization": "Bearer " + jwt
                }
            });
            
            console.log("Add category response:", response);

            if (response.status < 300) {
                return {
                    data: response.data
                }
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            }
        } catch (error: any) {
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static async delete(jwt: string, id: string): Promise<IResultObject<null>> {

        try {

            console.log("Deleting category with ID:", id);
            
            const response = await this.httpClient.delete<null>(`${id}`, {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            });
            
            console.log("Delete category response:", response);
            
            if (response.status < 300) {
                return {
                    data: null
                }
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            }
        } catch (error: any) {
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }
    

    static async edit(jwt: string, id: string, category: Partial<ICategory>): Promise<IResultObject<ICategory>> {
        try {
            console.log("Editing category with id:", id, "new data:", category);
            const response = await CategoryService.httpClient.put<ICategory>(`${id}`, category, {
                headers: {
                    "Authorization": "Bearer " + jwt
                }
            });

            console.log("Edit category response:", response);

            if (response.status < 300) {
                return {
                    data: response.data
                }
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            }
        } catch (error: any) {
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static async view(jwt: string, id: string): Promise<IResultObject<ICategory>> {
        try {
            console.log("Fetching category with id:", id);
            const response = await CategoryService.httpClient.get<ICategory>(`${id}`, {
                headers: {
                    "Authorization": "Bearer " + jwt
                }
            });
            
            console.log("View category response:", response);

            if (response.status < 300) {
                return {
                    data: response.data
                }
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            }
        } catch (error: any) {
            console.error("Error viewing category:", error);
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }
}

CategoryService.initializeInterceptor();