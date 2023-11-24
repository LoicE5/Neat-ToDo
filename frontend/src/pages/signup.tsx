import { FormEvent, useEffect, useState } from "react"
import { server } from '../../config.json'
import { useRouter } from 'next/router';
import storage from "@/utils/storage";
import { userLogin } from "./login";

export default function signup() {
    const router = useRouter()

    useEffect(() => {
        if (storage.jwt.exists())
            router.push('/')
    }, [])

    const [email, setEmail] = useState('')
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    async function handleFormSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()

        if (!email || !nickname || !password || !passwordConfirm)
            return alert(`Please fill the form as required`)

        if (password !== passwordConfirm)
            return alert(`Your passwords does not match`)

        const payload = {
            nickname: nickname,
            password: password,
            email: email
        }

        const response = await fetch(`http://${server.host}:${server.port}/auth/signup`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok)
            return alert(`Your signup have failed. Response code : ${response.status}. Error message : ${await response.text()}`)

        await userLogin(email, password, router)
    }

    return (
        <div style={{
            backgroundImage: `url("doom_eternal.jpg")`,
            backgroundSize: "cover",
            height: "100vh"
        }}>
            <a href="#">
                <img src="logoV1.png" alt="logo" style={{ position: "absolute", top: "0", right: "0", width: "100px", }} />
            </a>

            <form onSubmit={handleFormSubmit}>
                <div className="flex flex-col items-center mx-auto" style={{ paddingTop: "5vw" }}>
                    <div className="text-left" style={{ width: "35vw" }}>

                        <label htmlFor="email" className="text-white block">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Votre email"
                            className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                            required
                            onChange={event => setEmail(event.target.value)}
                        />

                        <label htmlFor="nickname" className="text-white block">Pseudo</label>
                        <input
                            type="text"
                            name="nickname"
                            placeholder="Votre pseudo"
                            className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                            required
                            onChange={event => setNickname(event.target.value)}
                        />

                        <label htmlFor="password" className="text-white block">Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Votre mot de passe"
                            className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                            required
                            onChange={event => setPassword(event.target.value)}
                        />

                        <label htmlFor="password-confirm" className="text-white block">Confirmez votre mot de passe</label>
                        <input
                            type="password"
                            name="password-confirm"
                            placeholder="Confirmez votre mot de passe"
                            className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                            required
                            onChange={event => setPasswordConfirm(event.target.value)}
                        />
                    </div>
                </div>
                <br />
                <div className="fixed bottom-0 w-full text-center mb-16" style={{ textAlign: "center" }}>
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