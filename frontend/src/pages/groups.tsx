import Header from "@/components/Header"
import Group from "@/components/Group"
import { groupGetResponse, userGetResponse, userGroupResponse } from "@/utils/interfaces"
import storage from "@/utils/storage"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { server } from '../../config.json'
import Link from "next/link"

export async function getGroups(user: userGetResponse): Promise<groupGetResponse[] | void> {
    const response = await fetch(`http://${server.host}:${server.port}/user/${user.id}/groups`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': storage.jwt.load()
        }
    })

    if (!response.ok)
        return alert(`We failed deleting your groups. Response code : ${response.status}. Error message : ${await response.text()}`)

    const responsePayload = await response.json()

    if (responsePayload.length <= 0)
        return []

    return responsePayload
}

export default function Groups() {
    const router = useRouter()
    const user = storage.user.load() as userGetResponse

    useEffect(() => {

        if (!storage.jwt.exists()) {
            router.push('/login')
            return
        }

        getGroups(user).then((groups: any) => {

            const elements = groups.map((group: userGroupResponse) => (
                <Group id={group.id} title={group.name} userCount={group.userCount} />
            ))

            setGroupElements(elements)
        })

    }, [])

    const [groupElements, setGroupElements] = useState([])

    const skewStyleContainer = {
        transform: 'skewX(-30deg)',
        transformOrigin: 'top right',
        width: '50%',
    }

    const skewStyleText = {
        transform: 'skewX(30deg)',
    }

    return (
        <div>
            <Header />

            <div style={skewStyleContainer}>
                <div className="bg-gray-800 p-4" >
                    <h1 className="font-bold text-lg ml-4 text-red-500 " style={skewStyleText}>Vos Groupes</h1>
                </div>
            </div>
            <br />
            <div style={{ zIndex: "1" }}>


                {groupElements.length > 0 ? groupElements : (<h2 style={{ textAlign: "center" }}>Vous n'êtes dans aucun groupe.</h2>)}

                {/* Div ci dessous permet de compenser la place pris par le footer,
                Pour pas que le dernier groupe de la liste se retrouve caché derrière */}
                <div style={{ height: "10vh" }}></div>
            </div>


            <div className="fixed bottom-0 w-full bg-gradient-to-t from-white via-white to-transparent filter blur-1" style={{ height: "15vh" }}>
            </div>
            <Link href="/createGroup">
                <button type="submit"
                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-8 rounded-full border border-black"
                    style={{
                        position: "fixed",
                        zIndex: "2",
                        marginTop: "2em",
                        bottom: "2em",
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}>
                    Créer un groupe
                </button>
            </Link>

        </div>
    )

}