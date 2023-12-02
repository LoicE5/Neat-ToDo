import Header from "@/components/Header"
import { userGetResponse } from "@/utils/interfaces"
import storage from "@/utils/storage"
import { FormEvent, useState } from "react"
import { server } from '../../config.json'
import { useRouter } from "next/router"

export default function CreateGroup() {
    const user = storage.user.load() as userGetResponse
    const router = useRouter()

    const skewStyleContainer = {
        transform: 'skewX(-30deg)',
        transformOrigin: 'top right',
        width: '50%',
    };

    const skewStyleText = {
        transform: 'skewX(30deg)',
    }

    const [groupName, setGroupName] = useState("")
    const [firstUserEmail, setFirstUserEmail] = useState(user.email)

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()

        if (!groupName || !firstUserEmail)
            return alert(`Please fill the form as required`)

        const payload = {
            name: groupName,
            firstUsersEmails: [firstUserEmail]
        }

        const response = await fetch(`http://${server.host}:${server.port}/group`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': storage.jwt.load()
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok)
            return alert(`We failed creating your group. Response code : ${response.status}. Error message : ${await response.text()}`)

        router.push('/groups')
    }

    return (
        <div>
            <Header />
            <div style={skewStyleContainer}>
                <div className="bg-gray-800 p-4" >
                    <h1 className="font-bold text-lg ml-4 text-red-500 " style={skewStyleText}>Créez votre nouveau groupe</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center" style={{ marginTop: "50px" }}>
                    <label>Nom de votre groupe</label>
                    <input
                        type="text"
                        name="inputNewGroupName"
                        placeholder="Projet Todoom, Département IT..."
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                        onChange={event => setGroupName(event.target.value)}
                        required
                    />
                </div>


                <div className="flex flex-col items-center" style={{ marginTop: "25px" }}>
                    <label htmlFor="email">Premier membre du groupe</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="jean.dupont@dauphine.eu"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                        value={user.email}
                        onChange={event => setFirstUserEmail(event.target.value)}
                        required
                    />
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
                    Créer le groupe
                </button>

            </form>

        </div>
    )

}