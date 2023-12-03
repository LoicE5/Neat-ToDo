import { TodoomStatus } from "@/utils/enums";
import { NextRouter, useRouter } from "next/router";

interface ToDoomProps {
    id: number,
    deadline: Date | string,
    status: string,
    title: string,
    description: string,
    author: string,
    router?: NextRouter
}

export default function Todoom({ id, deadline, status, title, description, author, router }: ToDoomProps) {
    let showStatus;
    switch (status) {
        case TodoomStatus.NotStarted:
            showStatus = <p className="ml-auto italic text-white">Pas commencé</p>
            break

        case TodoomStatus.InProgress:
            showStatus = <p className="ml-auto italic text-blue-300">En cours</p>
            break

        case TodoomStatus.Done:
            showStatus = <p className="ml-auto italic text-green-500">Terminé</p>
            break
        default:
            showStatus = <p className="ml-auto italic text-white">Statut inconnu</p>
            break
    }

    if (!(deadline instanceof Date))
        deadline = new Date(deadline)

    if (!router)
        router = useRouter()

    let todayDate = new Date()
    let late = null

    if (deadline < todayDate && status !== TodoomStatus.Done)
        late = <p className="mr-2 font-bold text-red-500">EN RETARD</p>

    return (
        <div
            className="rounded p-4 text-white"
            style={{
                margin: "2em",
                backgroundColor: "#706c6c",
                borderRadius: "1em",
                cursor: "pointer"
            }}
            onClick={() => router!.push(`/editTodoom?todoom_id=${id}`)}
        >
            <div className="flex">
                <h3 className="mr-auto text-lg font-bold">{title}</h3>
                <div className="flex">
                    {late}
                    {showStatus}
                </div>

            </div>
            <div>
                <p className="ml-10">{description}</p>
            </div>
            <div className="flex">
                <p className="mr-auto">{author}</p>
                <p className="ml-auto">{deadline.getDate()}/{deadline.getMonth() + 1}/{deadline.getFullYear()}</p>
            </div>
        </div>
    )
}
