import Header from "@/components/Header"
import { TodoomStatus } from "@/utils/enums"
import { useEffect, useState } from "react"
import { getGroups } from "./groups"
import { useRouter } from "next/router"
import storage from "@/utils/storage"
import { userGetResponse, userGroupResponse } from "@/utils/interfaces"

export default function CreateTodoom() {

    // Style
    const skewStyleContainer = {
        transform: 'skewX(-30deg)',
        transformOrigin: 'top right',
        width: '50%',
    }

    const skewStyleText = {
        transform: 'skewX(30deg)',
    }

    // Component logic
    const router = useRouter()
    const user = storage.user.load() as userGetResponse

    const [groups, setGroups] = useState([])
    const [groupOptions, setGroupOptions] = useState([])
    const [selectedGroupId, setselectedGroupId] = useState(0)

    const todayDate = new Date()

    /**
     * Gives a set of HTML options, each of them corresponding to 
     * @param groupId The id of the currently selected group in the relevant dropdown menu (via selectedGroupId)
     * @returns {HTMLOptionElement[]}
     */
    function groupUsersOptionElements(groupId: number): HTMLOptionElement[] | void {
        if (selectedGroupId <= 0)
            return

        const foundUsers = groups.find((group: userGroupResponse) => group.id === groupId)! as userGroupResponse

        if (!foundUsers)
            return

        return foundUsers.Users.map(oneUser => (
            <option id={`${oneUser.id}`} value={oneUser.id}>{oneUser.nickname} ({oneUser.email})</option>
        ) as any)
    }

    useEffect(() => {

        if (!storage.jwt.exists()) {
            router.push('/login')
            return
        }

        getGroups(user).then((groups: any) => {

            const groupOptions: any = [

                (<option id="0" value={0}>🏡 ToDoom Perso</option>),

                ...groups.map((group: userGroupResponse) => (
                    <option id={`${group.id}`} value={group.id}>{group.name}</option>
                ))
            ]

            setGroups(groups)
            setGroupOptions(groupOptions)
        })
    }, [])

    return (
        <div>
            <Header />
            <div style={skewStyleContainer}>
                <div className="bg-gray-800 p-4" >
                    <h1 className="font-bold text-lg ml-4 text-red-500 " style={skewStyleText}>Créez une nouvelle ToDoom</h1>
                </div>
            </div>

            <form action="">
                <div className="flex flex-col items-center" style={{ marginTop: "50px" }}>
                    <label>Le titre de votre ToDoom</label>
                    <input
                        type="text"
                        name="inptNewTDTitle"
                        placeholder="Faire virement Paypal à Alexandre"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                    />
                </div>


                <div className="flex flex-col items-center" style={{ marginTop: "25px" }}>
                    <label>Ajouter une description ?</label>
                    <input
                        type="text"
                        name="inptNewTDDescription"
                        placeholder="Pour le café d'avant-hier"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                    />
                </div>

                <div className="flex flex-col items-center" style={{ marginTop: "25px" }}>
                    <label>La deadline de cette ToDoom</label>
                    <input
                        type="date"
                        name="inptNewTDDeadline"
                        min="2023-01-01"
                        max="2050-12-31"
                        value={todayDate.toISOString().split('T')[0]}
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                    />
                </div>

                <div className="flex flex-col items-center" style={{ marginTop: "25px" }}>
                    <label>Dans quel groupe souhaitez-vous créer cette ToDoom ?</label>
                    <select
                        name="groupTD"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
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
                    >
                        {groupUsersOptionElements(selectedGroupId) as any}
                    </select>
                </div>

                <div className="flex flex-col items-center" style={{ marginTop: "25px" }}>
                    <label>Le statut de la ToDoom</label>
                    <select name="statusTD" className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4">
                        <option value={TodoomStatus.NotStarted}>Pas commencé</option>
                        <option value={TodoomStatus.InProgress} >En cours</option>
                        <option value={TodoomStatus.Done}>Terminé</option>
                    </select>
                </div>

                <button type="submit"
                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-8 rounded-full border border-black"
                    style={{ display: "block", margin: "auto", marginTop: "1em", marginBottom: "2em" }}>
                    Créer la ToDoom
                </button>

            </form>

        </div>
    )

}