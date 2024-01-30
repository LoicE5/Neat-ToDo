import Header from "@/components/Header"
import { userGetResponse } from "@/utils/interfaces"
import storage from "@/utils/storage"
import React, { FormEvent, useEffect, useState } from 'react'
import { server } from '../../config.json'
import { useRouter } from "next/router"
import SkewTitle from "@/components/SkewTitle"

interface userEditPayload {
    nickname: string,
    email: string,
    password?: string
}

export default function UserDetail() {

    const router = useRouter()
    const user = storage.user.load() as userGetResponse

    const [userNickname, setUserNickname] = useState(user.nickname)
    const [userEmail, setUserEmail] = useState(user.email)
    const [userPassword, setUserPassword] = useState("false")


    useEffect(() => {

        if (!storage.jwt.exists()) {
            router.push('/login')
            return
        }

    }, [])



    async function editUserOnSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()

        let payload: userEditPayload = {
            nickname: userNickname,
            email: userEmail,
        }

        if (userPassword && userPassword !== "false") {
            payload.password = userPassword
        }

        const url = `http://${server.host}:${server.port}/user/${user.id}`

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': storage.jwt.load()
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok)
            return alert(`We failed creating or editing your User. Response code : ${response.status}. Error message : ${await response.text()}`)

        await router.push('/workplace')
    }


    return (
        <div>
            <Header />
            <SkewTitle>Paramètres</SkewTitle>
            <br />

            <form onSubmit={editUserOnSubmit}>
                <div className="flex items-center">
                    <div className="bg-gray-300 rounded-md p-4 items-center border border-gray-800 ml-5 flex shadow-2xl">
                        <div className="flex flex-col items-center space-y-4">
                            <img
                                className="h-8 w-auto cursor-pointer"
                                src="back.png"
                                alt="backIcon"
                                draggable={false}
                                onClick={() => router.push('/workplace')}
                            />
                            <img
                                className="h-8 w-auto cursor-pointer"
                                src="refresh.png"
                                alt="refreshIcon"
                                draggable={false}
                                onClick={() => window.location.reload()}
                            />
                            <button
                                type="submit"
                                className="h-8 w-auto p-0 cursor-pointer border-none bg-none"
                            >
                                <img
                                    src="validation.png"
                                    alt="validationIcon"
                                    draggable={false}
                                    className="h-8 w-auto"
                                />
                            </button>

                        </div>
                    </div>
                    <div className="bg-gray-300 rounded-md p-4 items-center border border-gray-800 ml-5 shadow-2xl" style={{ width: "40%", height: "350px" }}>
                        <h3 className="text-gray-800" style={{ fontWeight: "bold", textAlign: "center", marginBottom: 0 }}>Compte</h3>
                        <br />
                        <div className=" items-center mx-auto" style={{ paddingTop: "1vw" }}>
                            <div className="text-left" style={{ width: "35vw" }}>
                                <label htmlFor="nickname" className="text-gray-800 block">Nickname</label>
                                <input
                                    type="nickname"
                                    name="inputNickname"
                                    value={userNickname}
                                    className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4 italic"
                                    onChange={event => setUserNickname(event.target.value)}
                                />
                                <label htmlFor="email" className="text-gray-800 block">Email</label>
                                <input
                                    type="email"
                                    name="inputEmail"
                                    value={userEmail}
                                    className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4 italic"
                                    onChange={event => setUserEmail(event.target.value)}
                                />
                                <label htmlFor="password" className="text-gray-800 block">Mot de passe</label>
                                <input
                                    type="password"
                                    name="inputPassword"
                                    value={userPassword}
                                    className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4 italic"
                                    onChange={event => setUserPassword(event.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-300 rounded-md p-4 items-center border border-gray-800 ml-5 shadow-2xl" style={{ width: "40%", height: "350px" }}>
                        <h3 className="text-gray-800" style={{ fontWeight: "bold", textAlign: "center", marginBottom: 0 }}>Données Personnelles (en travaux)</h3>
                        <br />
                        <div className="flex items-center justify-center mx-auto" style={{ paddingTop: "1vw", width: "14vw", height: "80%" }}>
                            <img
                                className="h-full w-full object-cover cursor-pointer"
                                src="work.png"
                                alt="coneIcon"
                                draggable={false}
                            />
                        </div>
                    </div>

                </div>
            </form>


        </div>
    )

}