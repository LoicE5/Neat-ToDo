import Header from "@/components/Header"
import Todoom from "@/components/Todoom"
import { groupGetResponse, todoomGetResponse, userGetResponse } from "@/utils/interfaces"
import storage from "@/utils/storage"
import React, { useEffect, useState } from 'react'
import { server } from '../../config.json'
import { useRouter } from "next/router"
import { removeUserFromGroup } from "@/components/Group"
import SkewTitle from "@/components/SkewTitle"

export default function GroupDetails() {

    const router = useRouter()
    const user = storage.user.load() as userGetResponse

    const [inputVisible, setInputVisible] = useState(false)
    const [textInput, setTextInput] = useState('')
    const [todoomElements, setTodoomElements] = useState([])
    const [userElements, setUserElements] = useState([])
    const [groupName, setGroupName] = useState("Groupe inconnu")
    const [groupId, setGroupId] = useState(0)

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

            if (todooms.length <= 0) {
                setTodoomElements([(<h2 key={0}>Il n'y a aucune Todoom dans ce groupe</h2>)] as any)
                getGroupNameById(groupIdInteger).then(name => setGroupName(name as string))
                return
            }

            // If we can, we avoid another API call by setting the group name from the todoom list
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

        setGroupId(groupIdInteger)

    }, [])

    function toggleInput() {
        setInputVisible(!inputVisible)

        // If hiding the input, clear the text
        if (!inputVisible) {
            setTextInput('')
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) {
        if ((event as React.KeyboardEvent<HTMLInputElement>).key === 'Enter')
            addUserToGroupByEmail((event as React.ChangeEvent<HTMLInputElement>).target.value, groupId)
    }

    async function getGroupTodoomsById(groupId: number): Promise<todoomGetResponse[] | void> {
        const response = await fetch(`http://${server.host}:${server.port}/todoom/group/${groupId}`, {
            method: 'GET',
            headers: {
                'Authorization': storage.jwt.load(),
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            console.error(`We failed getting the todooms of your group. Response code : ${response.status}. Error message : ${await response.text()}`)
            return await router.push('/groups') as any
        }

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

    async function deleteGroupById(groupId: number): Promise<void> {
        const response = await fetch(`http://${server.host}:${server.port}/group/${groupId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': storage.jwt.load(),
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok)
            return alert(`We failed deleting your group. Response code : ${response.status}. Error message : ${await response.text()}`)

        await router.push('/groups')
    }

    async function getGroupNameById(groupId: number): Promise<string | void> {
        const response = await fetch(`http://${server.host}:${server.port}/group/${groupId}`, {
            method: 'GET',
            headers: {
                'Authorization': storage.jwt.load(),
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok)
            return console.error(`We couldn't find the group you're looking for. Response code : ${response.status}. Error message : ${await response.text()}`)

        const responsePayload = await response.json() as groupGetResponse

        return responsePayload.name
    }

    async function addUserToGroupByEmail(userEmail: string, groupId: number) {
        const response = await fetch(`http://${server.host}:${server.port}/group/${groupId}/email/${userEmail}`, {
            method: 'PUT',
            headers: {
                'Authorization': storage.jwt.load(),
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok)
            return alert(`We couldn't add the user ${userEmail} to the group. Response code : ${response.status}. Error message : ${await response.text()}`)

        router.reload()
    }

    return (
        <div>
            <Header />

            <SkewTitle>{groupName}</SkewTitle>
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
                        <img
                            className="h-8 w-auto cursor-pointer"
                            src="trash.png"
                            alt="trashIcon"
                            draggable={false}
                            onClick={() => deleteGroupById(groupId)}
                        />
                        <img
                            className="h-8 w-auto cursor-pointer"
                            src="exitGroup.png"
                            alt="exitGroupIcon"
                            draggable={false}
                            onClick={() => removeUserFromGroup(groupId, user, router, false)}
                        />
                        <img
                            className="h-8 w-auto cursor-pointer"
                            src="add.png"
                            alt="addUserInGroupIcon"
                            draggable={false}
                            onClick={toggleInput}
                        />
                    </div>

                    {/* Div cachée qui s'active quand on clique sur l'icone Ajouter une personne dans le groupe */}
                    {inputVisible && (
                        <div className="mt-4 flex items-center justify-center">
                            <input
                                id="textInput"
                                className="border rounded px-2 py-1"
                                style={{ width: "20vw" }}
                                type="email"
                                placeholder="valentin@dauphine.eu"
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