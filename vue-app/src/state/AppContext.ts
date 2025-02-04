import { createContext } from "react";

export interface IUserInfo {
    "token": string,
    "refreshToken": string,
    "firstName": string,
    "lastName": string
}

export interface IUserContext {
    userInfo: IUserInfo | null,
    setUserInfo: (userInfo: IUserInfo | null) => void
}

export const AppContext = createContext<IUserContext | null>(null);
