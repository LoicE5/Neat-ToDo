import Header from "@/components/Header"
import Todoom from "@/components/Todoom"
import { server } from '../../config.json'
import storage from "@/utils/storage"
import { todoomGetResponse, userGetResponse } from "@/utils/interfaces"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { decodeSafeHtmlChars } from "@/utils/functions"
import SkewTitle from "@/components/SkewTitle"

export default function Workplace() {

    const router = useRouter()

    useEffect(() => {

        if (!storage.jwt.exists()) {
            router.push('/login')
            return
        }

        getAssigneeTodos()
    }, [])

    const user = storage.user.load() as userGetResponse
    const [todooms, setTodooms] = useState([])

    async function getAssigneeTodos(): Promise<void> {
        const response = await fetch(`http://${server.host}:${server.port}/todoom/assignee/${user.id}`, {
            method: 'GET',
            headers: {
                'Authorization': storage.jwt.load(),
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok)
            return alert(`We failed fetching your todoom. Response code : ${response.status}. Error message : ${await response.text()}`)

        const responsePayload = await response.json() as todoomGetResponse[]

        const todoomElements = responsePayload
            .sort((a: todoomGetResponse, b: todoomGetResponse) => b.status.localeCompare(a.status))
            .map((todoom: todoomGetResponse) => (
                <Todoom
                    key={todoom.id}
                    id={todoom.id}
                    title={todoom.title}
                    status={todoom.status}
                    description={decodeSafeHtmlChars(todoom.description as string) || ""}
                    author={todoom.author ? todoom.author.nickname : "Auteur supprimé"}
                    deadline={todoom.deadline || "Pas de deadline"}
                />
            ))

        setTodooms(todoomElements as any)
    }

    return (
        <div>
            <Header />
            <SkewTitle>Vos ToDoom Perso</SkewTitle>
            {todooms}
        </div>
    )

}


