import axios, { AxiosError } from "axios";
import AccountService from "./AccountService";
import type { IResultObject } from "@/types/IResultObject";
import type { ITask } from "@/types/ITask";

export default class TaskService {
    private constructor() {}

    private static httpClient = axios.create({
        baseURL: 'https://taltech.akaver.com/api/v1/TodoTasks/',
    });

    static async getAll(jwt: string): Promise<IResultObject<ITask[]>> {
        try {
            console.log("Fetching all task");
            const response = await TaskService.httpClient.get<ITask[]>("", {
                headers: {
                    "Authorization": "Bearer " + jwt
                }
            });
            console.log("Fetch all task response:", response);

            if (response.status < 300) {
                return {
                    data: response.data
                }
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            }
        } catch (error: any) {
            console.error("Error fetching all task:", error);
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static async add(jwt: string, task: Partial<ITask>): Promise<IResultObject<ITask>> {
        try {
            console.log("Adding new task:", task);
            const response = await TaskService.httpClient.post<ITask>("", task, {
                headers: {
                    "Authorization": "Bearer " + jwt
                }
            });
            console.log("Add task response:", response);

            if (response.status < 300) {
                return {
                    data: response.data
                }
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            }
        } catch (error: any) {
            console.error("Error adding task:", error);
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static async delete(jwt: string, id: string): Promise<IResultObject<null>> {
        try {
            console.log("Deleting task with ID:", id);
            const response = await TaskService.httpClient.delete<null>(`${id}`, {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            });
            console.log("Delete task response:", response);

            if (response.status === 204) {
                return {
                    data: null
                };
            }
            return {
                errors: [`${response.status} ${response.statusText}`]
            };
        } catch (error: unknown) {
            console.error("Error deleting task:", error);
            const message = axios.isAxiosError(error) 
                ? (error.response?.data?.detail || error.message || JSON.stringify(error))
                : 'An unknown error occurred';
            return {
                errors: [message]
            };
        }
    }
    

    static async edit(jwt: string, id: string, task: Partial<ITask>): Promise<IResultObject<ITask>> {
        try {
            console.log("Editing task with id:", id, "new data:", task);
            const response = await TaskService.httpClient.put<ITask>(`${id}`, task, {
                headers: {
                    "Authorization": "Bearer " + jwt
                }
            });
            console.log("Edit task response:", response);

            if (response.status < 300) {
                return {
                    data: response.data
                }
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            }
        } catch (error: any) {
            console.error("Error editing task:", error);
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static async view(jwt: string, id: string): Promise<IResultObject<ITask>> {
        try {
            console.log("Fetching task with id:", id);
            const response = await TaskService.httpClient.get<ITask>(`${id}`, {
                headers: {
                    "Authorization": "Bearer " + jwt
                }
            });
            console.log("View task response:", response);

            if (response.status < 300) {
                return {
                    data: response.data
                }
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            }
        } catch (error: any) {
            console.error("Error viewing task:", error);
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }
}
