import Header from "@/components/Header"
import { TodoomStatus } from "@/utils/enums"
import { useRouter } from "next/router"
import storage from "@/utils/storage"
import { todoomGetResponse, userGetResponse } from "@/utils/interfaces"
import TodoomForm from "@/components/TodoomForm"
import { useEffect, useState } from "react"
import { server } from '../../config.json'

export default function createTodoom() {

    const user = storage.user.load() as userGetResponse
    const router = useRouter()

    const [todoomResponsePayload, setTodoomResponsePayload] = useState({} as todoomGetResponse)
    
    useEffect(() => {

        const { todoom_id } = router.query
        const todoomIdInteger = parseInt(todoom_id as string)

        if (!todoomIdInteger) {
            router.push(`/404`)
            return
        }

        getTodoomById(todoomIdInteger).then((todoom: any) => {
            setTodoomResponsePayload(todoom)
        })

    }, [])

    async function getTodoomById(todoomId: number): Promise<todoomGetResponse | void> {
        const response = await fetch(`http://${server.host}:${server.port}/todoom/${todoomId}`)

        if (!response.ok) {
            if (response.status === 404)
                return await router.push(`/404`) as any
            else
                return alert(`We failed getting the information of the todoom. Response code : ${response.status}. Error message : ${await response.text()}`)
        }

        const responsePayload = await response.json() as todoomGetResponse

        return responsePayload
    }

    return (
        <>
            <Header />
            <TodoomForm
                todoomId={todoomResponsePayload.id}
                title={todoomResponsePayload.title}
                description={todoomResponsePayload.description}
                deadline={todoomResponsePayload.deadline}
                groupId={todoomResponsePayload.group_id}
                assigneeId={todoomResponsePayload.assignee_id}
                status={todoomResponsePayload.status}
                user={user}
                router={router}
                context="edit"
            />
        </>
    )

}