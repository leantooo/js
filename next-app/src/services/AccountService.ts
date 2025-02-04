import { IUserInfo } from "@/state/AppContext";
import axios from "axios";
import { IResultObject } from "../domain/IResultObject";
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

    static async refreshToken(jwt: string, refreshToken: string): Promise<IResultObject<{ token: string, refreshToken: string, firstName: string, lastName: string }>> {
        const refreshTokenData = {
            jwt: jwt,
            refreshToken: refreshToken
        };
        try {
            const response = await AccountService.httpClient.post<{ token: string, refreshToken: string, firstName: string, lastName: string }>("RefreshToken", refreshTokenData);
            if (response.status < 300) {
                return {
                    data: response.data
                };
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            };
        } catch (error: any) {
            console.error("Refresh token error:", error);
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static checkTokenExpiration(jwt: string): boolean {
        const decodedToken: any = jwtDecode(jwt);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp > currentTime;
    }
}
