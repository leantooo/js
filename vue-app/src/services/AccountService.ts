import axios from "axios";
import type { IResultObject } from "@/types/IResultObject";
import type { IUserInfo } from "@/types/IUserInfo";
import { jwtDecode } from "jwt-decode";


export default class AccountService {
    private constructor() {}

    private static httpClient = axios.create({
        baseURL: 'https://taltech.akaver.com/api/v1/account/',
    });

    static async login(email: string, pwd: string): Promise<IResultObject<IUserInfo>> {
        const loginData = {
            email: email,
            password: pwd
        }
        try {
            const response = await AccountService.httpClient.post<IUserInfo>("login", loginData);
            if (response.status < 300) {
                const userInfo = response.data;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                return {
                    data: userInfo
                };
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            }
        } catch (error: any) {
            console.error("Login error:", error);
            return {
                errors: [error.message || JSON.stringify(error)]
            };
        }
    }

    static async register(email: string, pwd: string, firstName: string, lastName: string): Promise<IResultObject<IUserInfo>> {
        const registrationData = {
            email: email,
            password: pwd,
            firstName: firstName,
            lastName: lastName
        };
        try {
            const response = await AccountService.httpClient.post<IUserInfo>("register", registrationData);
            if (response.status < 300) {
                return {
                    data: response.data
                };
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            };
        } catch (error: any) {
            console.error("Registration error:", error);
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }
}
