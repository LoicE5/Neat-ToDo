import { TodoomStatus } from "@/utils/enums"
import { FormEvent, useEffect, useState } from "react"
import { getGroups } from "@/pages/groups"
import { NextRouter, useRouter } from "next/router"
import storage from "@/utils/storage"
import { userGetResponse, userGroupGetResponse } from "@/utils/interfaces"
import { server } from '../../config.json'
import { decodeSafeHtmlChars } from "@/utils/functions"
import SkewTitle from "./SkewTitle"

interface TodoomFormProps {
    todoomId?: number,
    title?: string,
    description?: string,
    deadline?: Date | string,
    groupId?: number,
    assigneeId?: number,
    status: TodoomStatus,
    user?: userGetResponse,
    router?: NextRouter,
    context: 'create' | 'edit'
}

export default function TodoomForm({ todoomId, title, description, deadline, groupId, assigneeId, status, user, router, context }: TodoomFormProps) {

    // Style

    // Component logic

    // Props check and definition
    if (!router)
        router = useRouter()

    if (!user)
        user = storage.user.load() as userGetResponse

    if (deadline instanceof Date)
        deadline = deadline.toISOString().split('T')[0]

    if (deadline?.includes('T'))
        deadline = deadline.split('T')[0]

    // Hooks
    const [groups, setGroups] = useState([])
    const [groupOptions, setGroupOptions] = useState([])
    const [selectedGroupId, setselectedGroupId] = useState(groupId || 0)

    const [todoomTitle, setTodoomTitle] = useState(title || '')
    const [todoomDescription, setTodoomDescription] = useState(description || '')
    const [todoomDeadline, setTodoomDeadline] = useState(deadline as string || '')
    const [todoomAssigneeId, setTodoomAssigneeId] = useState(assigneeId || 0)
    const [todoomFirstStatus, setTodoomFirstStatus] = useState(status)


    // onMount
    useEffect(() => {

        if (!storage.jwt.exists()) {
            router!.push('/login')
            return
        }

        getGroups(user!).then((groups: any) => {

            const groupOptions: any = [

                (<option key={0} value={0}>🏡 ToDoom Perso</option>),

                ...groups.map((group: userGroupGetResponse) => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                ))
            ]

            setGroups(groups)
            setGroupOptions(groupOptions)
        })
    }, [])

    // Methods
    /**
     * Gives a set of HTML options, each of them corresponding to a user of the selected group
     * @param groupId The id of the currently selected group in the relevant dropdown menu (via selectedGroupId)
     * @returns {HTMLOptionElement[]}
     */
    function groupUsersOptionElements(groupId: number): HTMLOptionElement[] | void {
        if (selectedGroupId <= 0)
            return

        const foundUsers = groups.find((group: userGroupGetResponse) => group.id === groupId)! as userGroupGetResponse

        if (!foundUsers)
            return

        // We sort the users in order to keep the current user first, so that the first option available is always his nickname & email
        return foundUsers.Users
            .sort((a, b): number => {
                if (a.id === user!.id)
                    return -1
                if (b.id === user!.id)
                    return 1
                return a.id - b.id
            })
            .map(oneUser => (
                <option key={oneUser.id} value={oneUser.id}>{oneUser.nickname} ({oneUser.email})</option>
            ) as any)
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()

        if (!todoomTitle)
            return alert(`Please give your todoom a title`)

        const payload = {
            title: todoomTitle,
            description: todoomDescription || null,
            deadline: todoomDeadline || null,
            group_id: selectedGroupId > 0 ? selectedGroupId : null,
            assignee_id: todoomAssigneeId > 0 ? todoomAssigneeId : user!.id,
            author_id: user!.id,
            status: todoomFirstStatus
        }

        let url = `http://${server.host}:${server.port}/todoom`
        if (context === 'edit')
            url = url.concat(`/${todoomId}`)

        console.log(url)

        const method = context === 'create' ? 'POST' : 'PUT'

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': storage.jwt.load()
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok)
            return alert(`We failed creating or editing your ToDoom. Response code : ${response.status}. Error message : ${await response.text()}`)

        if (selectedGroupId > 0)
            // TODO If the group_id is set, redirect to the page of this group instead of workplace (GET param)
            router!.push('/workplace')
        else
            router!.push('/workplace')
    }

    return (
        <div>
            <SkewTitle>{context === 'create' ? 'Créez une nouvelle ToDoom' : 'Modifiez une ToDoom'}</SkewTitle>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center" style={{ marginTop: "50px" }}>
                    <label>Le titre de votre ToDoom</label>
                    <input
                        type="text"
                        name="inptNewTDTitle"
                        placeholder="Faire virement Paypal à Alexandre"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                        required
                        value={decodeSafeHtmlChars(todoomTitle)}
                        onChange={event => setTodoomTitle(event.target.value)}
                    />
                </div>


                <div className="flex flex-col items-center" style={{ marginTop: "25px" }}>
                    <label>Ajouter une description ?</label>
                    <input
                        type="text"
                        name="inptNewTDDescription"
                        placeholder="Pour le café d'avant-hier"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                        value={decodeSafeHtmlChars(todoomDescription)}
                        onChange={event => setTodoomDescription(event.target.value)}
                    />
                </div>

                <div className="flex flex-col items-center" style={{ marginTop: "25px" }}>
                    <label>La deadline de cette ToDoom</label>
                    <input
                        type="date"
                        name="inptNewTDDeadline"
                        min="2023-01-01"
                        max="2050-12-31"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                        value={todoomDeadline}
                        onChange={event => setTodoomDeadline(event.target.value)}
                    />
                </div>

                <div className="flex flex-col items-center" style={{ marginTop: "25px" }}>
                    <label>Dans quel groupe souhaitez-vous créer cette ToDoom ?</label>
                    <select
                        name="groupTD"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                        value={selectedGroupId}
                        onChange={event => setselectedGroupId(Number(event.target.value))}
                    >
                        {groupOptions}
                    </select>
                </div>

                <div className="flex flex-col items-center" style={{
                    marginTop: "25px",
                    display: selectedGroupId <= 0 ? 'none' : 'flex'
                }}>
                    <label>À quel membre du groupe souhaitez-vous assigner cette ToDoom ?</label>
                    <select
                        name="groupTD"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                        disabled={selectedGroupId <= 0}
                        value={todoomAssigneeId}
                        onChange={event => setTodoomAssigneeId(Number(event.target.value))}
                    >
                        {groupUsersOptionElements(selectedGroupId) as any}
                    </select>
                </div>

                <div className="flex flex-col items-center" style={{ marginTop: "25px" }}>
                    <label>Le statut de la ToDoom</label>
                    <select
                        name="statusTD"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                        value={todoomFirstStatus}
                        onChange={event => setTodoomFirstStatus(event.target.value as TodoomStatus)}
                    >
                        <option value={TodoomStatus.NotStarted}>Pas commencé</option>
                        <option value={TodoomStatus.InProgress}>En cours</option>
                        <option value={TodoomStatus.Done}>Terminé</option>
                    </select>
                </div>

                <button type="submit"
                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-8 rounded-full border border-black"
                    style={{ display: "block", margin: "auto", marginTop: "1em", marginBottom: "2em" }}>
                    {context === 'create' ? 'Créer la ToDoom' : 'Modifier la ToDoom'}
                </button>

            </form>

        </div>
    )

}