import axios, { AxiosError } from "axios";
import AccountService from "./AccountService";
import type { IResultObject } from "@/types/IResultObject";
import type { IPriority } from "@/types/IPriority";

export default class PriorityService {
    private constructor() {}

    private static httpClient = axios.create({
        baseURL: 'https://taltech.akaver.com/api/v1/TodoPriorities/',
    });

    static async getAll(jwt: string): Promise<IResultObject<IPriority[]>>{
        try {
            const response = await PriorityService.httpClient.get<IPriority[]>("", {
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


    static async add(jwt: string, priority: Partial<IPriority>): Promise<IResultObject<IPriority>> {
        try {
            console.log("Adding new priority:", priority);
            const response = await PriorityService.httpClient.post<IPriority>("", priority, {
                headers: {
                    "Authorization": "Bearer " + jwt
                }
            });
            
            console.log("Add priority response:", response);

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

            console.log("Deleting priority with ID:", id);
            
            const response = await this.httpClient.delete<null>(`${id}`, {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            });
            
            console.log("Delete priority response:", response);
            
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
    

    static async edit(jwt: string, id: string, priority: Partial<IPriority>): Promise<IResultObject<IPriority>> {
        try {
            console.log("Editing priority with id:", id, "new data:", priority);
            const response = await PriorityService.httpClient.put<IPriority>(`${id}`, priority, {
                headers: {
                    "Authorization": "Bearer " + jwt
                }
            });

            console.log("Edit priority response:", response);

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

    static async view(jwt: string, id: string): Promise<IResultObject<IPriority>> {
        try {
            console.log("Fetching priority with id:", id);
            const response = await PriorityService.httpClient.get<IPriority>(`${id}`, {
                headers: {
                    "Authorization": "Bearer " + jwt
                }
            });
            
            console.log("View priority response:", response);

            if (response.status < 300) {
                return {
                    data: response.data
                }
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            }
        } catch (error: any) {
            console.error("Error viewing priority:", error);
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }
}
