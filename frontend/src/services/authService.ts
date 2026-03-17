import { djangoBackend } from "../services/linkService";

type JwtResponseType = {
    refresh: string,
    access: string
}

export async function apiLoginRequest(username: string, password: string) {
    try {
        const response = await djangoBackend.post("/api/token/", { username, password })
        const jwtData:JwtResponseType = await response.data

        localStorage.setItem("access", jwtData.access)
        localStorage.setItem("refresh", jwtData.refresh)

        return jwtData
    } catch (error) {
        console.log("Valami nem jó!");
        console.log(error);
        return undefined
    }
}