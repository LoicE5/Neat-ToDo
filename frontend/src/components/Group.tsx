import Link from "next/link"
import { server } from '../../config.json'
import storage from "@/utils/storage"
import { userGetResponse } from "@/utils/interfaces"
import { useRouter } from "next/router"

interface GroupProps {
    id: number,
    title: string,
    userCount: number
}

const Group = ({ id, title, userCount }: GroupProps) => {
    const router = useRouter()

    async function deleteUserFromGroup(): Promise<void> {
        const user = storage.user.load() as userGetResponse

        const response = await fetch(`http://${server.host}:${server.port}/group/${id}/${user.id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': storage.jwt.load()
            }
        })

        if (!response.ok)
            return alert(`We failed removing you from the group. Response code : ${response.status}. Error message : ${await response.text()}`)

        router.reload()
    }

    return (
        // TODO Il faudra remplacer la cible du lien
        <Link href="/workplace" style={{ textDecoration: "none", color: "black" }}>
            <div style={{
                marginLeft: "7em", marginRight: "7em", marginBottom: "1.7em", paddingTop: "0.5em", borderRadius: "1em", height: "92px", backgroundColor: "#D7D7D7", position: "relative"
            }}>

                <h3 className="mr-auto ml-8 text-lg font-bold">{title}</h3>
                <div className="flex justify-between">
                    <p style={{ marginLeft: "4em" }}>{userCount} membres</p>
                    <div
                        style={{
                            display: "block",
                            width: "2em",
                            marginRight: "1em"
                        }}
                        onClick={deleteUserFromGroup}
                    >
                        <img src="trash.png" alt="TrashIcon" />
                    </div>

                </div>
                <div style={{
                    backgroundColor: "#706c6c", borderRadius: "10em",
                    position: "absolute", bottom: "0", width: "100%", height: "10px"
                }}></div>
            </div>

        </Link>

    )

}

export default Group