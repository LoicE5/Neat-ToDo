import { TodoStatus } from "@/utils/enums"
import { FormEvent, useEffect, useState } from "react"
import { getGroups } from "@/pages/groups"
import { NextRouter, useRouter } from "next/router"
import storage from "@/utils/storage"
import { userGetResponse, userGroupGetResponse } from "@/utils/interfaces"
import { server } from '../../config.json'
import { decodeSafeHtmlChars } from "@/utils/functions"
import SkewTitle from "./SkewTitle"

interface TodoFormProps {
    todoId?: number,
    title?: string,
    description?: string,
    deadline?: Date | string,
    groupId?: number,
    assigneeId?: number,
    status: TodoStatus,
    user?: userGetResponse,
    router?: NextRouter,
    context: 'create' | 'edit'
}

export default function TodoForm({ todoId, title, description, deadline, groupId, assigneeId, status, user, router, context }: TodoFormProps) {

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

    const [todoTitle, setTodoTitle] = useState(title || '')
    const [todoDescription, setTodoDescription] = useState(description || '')
    const [todoDeadline, setTodoDeadline] = useState(deadline as string || '')
    const [todoAssigneeId, setTodoAssigneeId] = useState(assigneeId || 0)
    const [todoFirstStatus, setTodoFirstStatus] = useState(status)


    // onMount
    useEffect(() => {

        if (!storage.jwt.exists()) {
            router!.push('/login')
            return
        }

        getGroups(user!).then((groups: any) => {

            const groupOptions: any = [

                (<option key={0} value={0}>🏡 ToDo Perso</option>),

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

        if (!todoTitle)
            return alert(`Please give your todo a title`)

        const payload = {
            title: todoTitle,
            description: todoDescription || null,
            deadline: todoDeadline || null,
            group_id: selectedGroupId > 0 ? selectedGroupId : null,
            assignee_id: todoAssigneeId > 0 ? todoAssigneeId : user!.id,
            author_id: user!.id,
            status: todoFirstStatus
        }

        let url = `http://${server.host}:${server.port}/todo`
        if (context === 'edit')
            url = url.concat(`/${todoId}`)

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
            return alert(`We failed creating or editing your ToDo. Response code : ${response.status}. Error message : ${await response.text()}`)

        if (selectedGroupId > 0)
            // TODO If the group_id is set, redirect to the page of this group instead of workplace (GET param)
            router!.push('/workplace')
        else
            router!.push('/workplace')
    }

    return (
        <div>
            <SkewTitle>{context === 'create' ? 'Créez une nouvelle ToDo' : 'Modifiez une ToDo'}</SkewTitle>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center" style={{ marginTop: "50px" }}>
                    <label>Le titre de votre ToDo</label>
                    <input
                        type="text"
                        name="inptNewTDTitle"
                        placeholder="Faire virement Paypal à Alexandre"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                        required
                        value={decodeSafeHtmlChars(todoTitle)}
                        onChange={event => setTodoTitle(event.target.value)}
                    />
                </div>


                <div className="flex flex-col items-center" style={{ marginTop: "25px" }}>
                    <label>Ajouter une description ?</label>
                    <input
                        type="text"
                        name="inptNewTDDescription"
                        placeholder="Pour le café d'avant-hier"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                        value={decodeSafeHtmlChars(todoDescription)}
                        onChange={event => setTodoDescription(event.target.value)}
                    />
                </div>

                <div className="flex flex-col items-center" style={{ marginTop: "25px" }}>
                    <label>La deadline de cette ToDo</label>
                    <input
                        type="date"
                        name="inptNewTDDeadline"
                        min="2023-01-01"
                        max="2050-12-31"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                        value={todoDeadline}
                        onChange={event => setTodoDeadline(event.target.value)}
                    />
                </div>

                <div className="flex flex-col items-center" style={{ marginTop: "25px" }}>
                    <label>Dans quel groupe souhaitez-vous {context === 'create' ? 'créer' : 'modifier'} cette ToDo ?</label>
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
                    <label>À quel membre du groupe souhaitez-vous assigner cette ToDo ?</label>
                    <select
                        name="groupTD"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                        disabled={selectedGroupId <= 0}
                        value={todoAssigneeId}
                        onChange={event => setTodoAssigneeId(Number(event.target.value))}
                    >
                        {groupUsersOptionElements(selectedGroupId) as any}
                    </select>
                </div>

                <div className="flex flex-col items-center" style={{ marginTop: "25px" }}>
                    <label>Le statut de la ToDo</label>
                    <select
                        name="statusTD"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                        value={todoFirstStatus}
                        onChange={event => setTodoFirstStatus(event.target.value as TodoStatus)}
                    >
                        <option value={TodoStatus.NotStarted}>Pas commencé</option>
                        <option value={TodoStatus.InProgress}>En cours</option>
                        <option value={TodoStatus.Done}>Terminé</option>
                    </select>
                </div>

                <button type="submit"
                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-8 rounded-full border border-black"
                    style={{ display: "block", margin: "auto", marginTop: "1em", marginBottom: "2em" }}>
                    {context === 'create' ? 'Créer la ToDo' : 'Modifier la ToDo'}
                </button>

            </form>

        </div>
    )

}