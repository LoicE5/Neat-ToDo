import Header from "@/components/Header"
import Todoom from "@/components/Todoom"
import { todoomGetResponse, userGetResponse } from "@/utils/interfaces"
import storage from "@/utils/storage"
import React, { useEffect, useState } from 'react'
import { server } from '../../config.json'
import { useRouter } from "next/router"

export default function GroupDetails() {

    const router = useRouter()
    const user = storage.user.load() as userGetResponse

    const skewStyleContainer = {
        transform: 'skewX(-30deg)',
        transformOrigin: 'top right',
        width: '50%',
    }

    const skewStyleText = {
        transform: 'skewX(30deg)',
    }

    const [inputVisible, setInputVisible] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [todoomElements, setTodoomElements] = useState([])
    const [userElements, setUserElements] = useState([])
    const [groupName, setGroupName] = useState("Groupe inconnu")

    const toggleInput = () => {
        setInputVisible(!inputVisible);

        // If hiding the input, clear the text
        if (!inputVisible) {
            setTextInput('');
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            // Requete pour le backend
            alert('Request backend: ' + textInput);

            // Vide et cache l'input
            setTextInput('');
            setInputVisible(false);
        }
    }

    async function getGroupTodoomsById(groupId: number): Promise<todoomGetResponse[] | void> {
        const response = await fetch(`http://${server.host}:${server.port}/todoom/group/${groupId}`, {
            method: 'GET',
            headers: {
                'Authorization': storage.jwt.load(),
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok)
            return alert(`We failed getting the todooms of your group. Response code : ${response.status}. Error message : ${await response.text()}`)

        const responsePayload = await response.json() as todoomGetResponse[]

        return responsePayload
    }

    async function getUsersOfGroupById(groupId: number): Promise<userGetResponse[] | void> {
        const response = await fetch(`http://${server.host}:${server.port}/group/${groupId}/users`, {
            method: 'GET',
            headers: {
                'Authorization': storage.jwt.load(),
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok)
            return alert(`We failed getting the users of your group. Response code : ${response.status}. Error message : ${await response.text()}`)

        const responsePayload = await response.json() as userGetResponse[]

        return responsePayload
    }

    useEffect(() => {

        if (!storage.jwt.exists()) {
            router.push('/login')
            return
        }

        const { group_id } = router.query
        let groupIdInteger = parseInt(group_id as string)

        if (!groupIdInteger) {

            // If we access the page via another way than the Next Router (direct URL access or other), we can check the GET params the old way
            const urlSearchParams = new URLSearchParams(window.location.search)
            const groupIdFromQueryString = urlSearchParams.get('group_id')

            if (groupIdFromQueryString) {
                groupIdInteger = parseInt(groupIdFromQueryString)
            } else {
                router.push('/404')
                return
            }
        }

        getGroupTodoomsById(groupIdInteger).then((todooms: any) => {

            setGroupName((todooms as todoomGetResponse[])[0].group!.name)

            setTodoomElements(
                todooms.map((todoom: todoomGetResponse) => (
                    <Todoom
                        key={todoom.id}
                        id={todoom.id}
                        deadline={todoom.deadline as string}
                        status={todoom.status}
                        title={todoom.title}
                        description={todoom.description as string}
                        author={todoom.author!.nickname}
                        router={router}
                    />
                ))
            )
        })

        getUsersOfGroupById(groupIdInteger).then((users: any) => {
            setUserElements(
                users.map((oneUser: userGetResponse) => (
                    <li key={oneUser.id}>{oneUser.nickname} (<i>{oneUser.email}</i>)</li>
                ))
            )
        })

    }, [])

    return (
        <div>
            <Header />

            <div style={skewStyleContainer}>
                <div className="bg-gray-800 p-4" >
                    <h1 className="font-bold text-lg ml-4 text-red-500" style={skewStyleText}>{groupName}</h1>
                </div>
            </div>
            <br />

            <div className="flex">

                <div className="flex-grow">
                    {todoomElements}
                </div>


                <aside className="bg-gray-300 rounded-md p-4 items-center ml-auto w-20vw mr-4 border border-gray-800"
                    style={{ height: "50vh" }}
                >
                    <h3 style={{ color: "red", fontWeight: "bold", textAlign: "center", marginBottom: "0.5em" }}>{groupName}</h3>
                    <div className="flex space-x-4 justify-center">
                        <div
                        // onClick={}
                        >
                            <img className="h-8 w-auto" src="trash.png" alt="trashIcon" draggable={false} />
                        </div>

                        <div
                        // onClick={}
                        >
                            <img className="h-8 w-auto" src="exitGroup.png" alt="exitGroupIcon" draggable={false} />
                        </div>

                        <div
                            onClick={toggleInput}
                            className="cursor-pointer"
                        >
                            <img className="h-8 w-auto" src="add.png" alt="addUserInGroupIcon" draggable={false} />
                        </div>
                    </div>

                    {/* Div cachée qui s'active quand on clique sur l'icone Ajouter une personne dans le groupe */}
                    {inputVisible && (
                        <div className="mt-4 flex items-center justify-center">
                            <input
                                id="textInput"
                                className="border rounded px-2 py-1"
                                style={{ width: "20vw" }}
                                type="text"
                                placeholder="Mail de la personne à ajouter"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    )}

                    <br />
                    <div style={{ textAlign: "center", overflowY: "auto" }}>
                        <ul>
                            {userElements}
                        </ul>
                    </div>
                </aside>
            </div>



        </div>
    )

}