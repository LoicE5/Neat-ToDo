import Header from "@/components/Header"
import { useRouter } from "next/router"
import storage from "@/utils/storage"
import { todoomGetResponse, userGetResponse } from "@/utils/interfaces"
import TodoomForm from "@/components/TodoomForm"
import { useEffect, useState } from "react"
import { server } from '../../config.json'

export default function createTodoom() {

    const router = useRouter()
    const user = storage.user.load() as userGetResponse

    const [todoomFormElement, setTodoomFormElement] = useState((<p>Please wait for the Todoom to load</p>))

    useEffect(() => {
        
        if (!storage.jwt.exists()) {
            router.push('/login')
            return
        }

        const { todoom_id } = router.query
        let todoomIdInteger = parseInt(todoom_id as string)

        if (!todoomIdInteger) {

            // If we access the page via another way than the Next Router (direct URL access or other), we can check the GET params the old way
            const urlSearchParams = new URLSearchParams(window.location.search)
            const todoomIdFromQueryString = urlSearchParams.get('todoom_id')

            if (todoomIdFromQueryString) {
                todoomIdInteger = parseInt(todoomIdFromQueryString)
            } else {
                router.push('/404')
                return
            }
        }

        getTodoomById(todoomIdInteger).then((todoom: any) => {
            setTodoomFormElement((
                <TodoomForm
                    todoomId={todoom.id}
                    title={todoom.title}
                    description={todoom.description}
                    deadline={todoom.deadline}
                    groupId={todoom.group_id}
                    assigneeId={todoom.assignee_id}
                    status={todoom.status}
                    user={user}
                    router={router}
                    context="edit"
                />
            ))
        })

    }, [])

    async function getTodoomById(todoomId: number): Promise<todoomGetResponse | void> {
        const response = await fetch(`http://${server.host}:${server.port}/todoom/${todoomId}`, {
            method: 'GET',
            headers: {
                'Authorization': storage.jwt.load(),
                'Content-Type': 'application/json'
            }
        })

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
            {todoomFormElement}
        </>
    )

}