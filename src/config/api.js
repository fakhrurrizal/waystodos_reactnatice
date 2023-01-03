import axios from "axios"

export const API = axios.create({
            baseURL: "https://api.kontenbase.com/query/api/v1/d83e7027-4c17-44ea-b57c-805cb012d2af"  
})
export function setAuthorization(token){
    if(!token){
        delete API.defaults.headers.common
        return
    }
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`
}