import { CHATS_URL } from "@/lib/apiEndpoints"


export const fetchChats = async (groupId : string) =>{
    const res = await fetch(`${CHATS_URL}/${groupId}`,{
        cache: "no-cache"
    })

    if(!res.ok) throw new Error('Failed to fetch Chats. Try again later!')
    
    const response = await res.json()
    if(response?.data) {
        return response.data
    }
    else return [];
}
