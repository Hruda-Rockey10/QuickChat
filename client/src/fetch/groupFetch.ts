import { CHAT_GROUP_URL, CHAT_GROUP_USER_URL } from "@/lib/apiEndpoints"

export const fetchChatGroups = async (token : string) =>{
    const res = await fetch(CHAT_GROUP_URL,{
        headers : {
            Authorization : token,
            'Content-Type': 'application/json',
        },
        next: {
            revalidate: 60*60,
            tags: ['dashboard']
        }
    })

    if(!res.ok) throw new Error('Failed to fetch chat groups. Try again later!')
    
    const response = await res.json()
    if(response?.data) {
        return response.data
    }
    else return [];
}

export const fetchChatGroup = async (id : string) =>{
    const res = await fetch(`${CHAT_GROUP_URL}/${id}`,{
        cache: "no-cache"
    })

    if(!res.ok) throw new Error('Failed to fetch chat group. Try again later!')
    
    const response = await res.json()
    if(response?.data) {
        return response.data
    }
    else return null;
}

export const fetchChatUsers = async (id : string) =>{
    const res = await fetch(`${CHAT_GROUP_USER_URL}?group_id=${id}`,{
        cache: "no-cache"
    })

    if(!res.ok) throw new Error('Failed to fetch chat group users. Try again later!')
    
    const response = await res.json()
    if(response?.data) {
        return response.data
    }
    else return [];
}