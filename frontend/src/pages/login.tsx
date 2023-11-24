import { FormEvent, useState, useEffect } from "react"
import { NextRouter, useRouter } from 'next/router'
import storage from "@/utils/storage"
import { server } from '../../config.json'
import { loginResponse } from "@/utils/interfaces"

export async function userLogin(email: string, password: string, router: NextRouter) {
    // In this function, we assume that all necessary checks have been done in handleFormSubmit

    const payload = {
        email: email,
        password: password
    }

    const response = await fetch(`http://${server.host}:${server.port}/auth/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    // If we can't login the user automatically, we invite him to do so
    if (!response.ok) {
        if (router.asPath.includes('login'))
            return alert(`Your login have failed. Response code : ${response.status}. Error message : ${await response.text()}`)
        else
            return router.push('/login')
    }

    const responsePayload: loginResponse = await response.json()

    storage.jwt.save(responsePayload.token)
    storage.user.save(responsePayload.user)

    router.push('/workplace')
}

export default function login() {
    const router = useRouter()

    useEffect(() => {
        if (storage.jwt.exists())
            router.push('/workplace')
    }, [])

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleFormSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()

        if (!email || !password)
            return alert(`Please fill the form as required`)

        await userLogin(email, password, router)
    }

    return (
        <div
            className="flex flex-col items-center mx-auto"
            style={{
                backgroundImage: `url("doom_eternal.jpg")`,
                backgroundSize: "cover",
                height: "100vh",
                // filter: "blur(5px)"
            }}
        >
            <a href="#">
                <img src="logoV1.png" alt="logo" style={{ width: "200px" }} />
            </a>

            <form onSubmit={handleFormSubmit}>
                <div className="flex flex-col items-center mx-auto" style={{ paddingTop: "1vw" }}>

                    <div className="text-left" style={{ width: "35vw" }}>
                        <label htmlFor="email" className="text-white block">Email</label>
                        <input
                            type="email"
                            name="inputEmail"
                            placeholder="Votre email"
                            className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                            onChange={event => setEmail(event.target.value)}
                        />

                        <label htmlFor="password" className="text-white block">Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Votre mot de passe"
                            className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                            onChange={event => setPassword(event.target.value)}
                        />
                    </div>

                </div>
                <br />
                <div className="bottom-0 w-full text-center mb-16" style={{ textAlign: "center" }}>
                    <button
                        type="submit"
                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-8 rounded-full border border-black"
                    >
                        Se connecter
                    </button>
                </div>
            </form>
        </div>
    )
}