import Header from "@/components/Header"
import Group from "@/components/group"
import { userGetResponse, userGroupResponse } from "@/utils/interfaces"
import storage from "@/utils/storage"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { server } from '../../config.json'

export default function Groups() {
    const router = useRouter()
    const user = storage.user.load() as userGetResponse

    useEffect(() => {

        if (!storage.jwt.exists()) {
            router.push('/login')
            return
        }

        getGroups()
    }, [])

    const [groups, setGroups] = useState([])

    async function getGroups(): Promise<void> {
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
            return setGroups([])

        const groupsElements = responsePayload.map((group: userGroupResponse) => (
            <Group id={group.id} title={group.name} userCount={group.userCount} />
        ))

        setGroups(groupsElements)
    }

    return (
        <div>
            <Header />
            <h1
                style={{
                    fontWeight: 'bold',
                    fontSize: '1.5em',
                    marginLeft: '20px'
                }}>
                Vos Groupes
            </h1>
            <br />
            <div style={{ zIndex: "1" }}>

                {groups.length > 0 ? groups : (<h2 style={{ textAlign: "center" }}>Vous n'êtes dans aucun groupe.</h2>)}

                {/* Div ci dessous permet de compenser la place pris par le footer,
                Pour pas que le dernier groupe de la liste se retrouve caché derrière */}
                <div style={{ height: "10vh" }}></div>
            </div>


            <div className="fixed bottom-0 w-full bg-gradient-to-t from-white via-white to-transparent filter blur-1" style={{ height: "15vh" }}>
            </div>
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
        </div>
    )

}