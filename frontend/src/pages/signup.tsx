export default function signup() {
    return (
        <div style={{
            backgroundImage: `url("doom_eternal.jpg")`,
            backgroundSize: "cover",
            height: "100vh"
            }}>
            <a href="#"><img src="logoV1.png" alt="logo" style={{position: "absolute", top: "0", right: "0", width: "100px",}}/></a>
            
            <form action="">
            <div className="flex flex-col items-center mx-auto" style={{paddingTop: "5vw" }}>
                <div className="text-left" style={{width:"35vw"}}>
                    <label htmlFor="inputEmail" className="text-white block">Email</label>
                    <input type="email" name="inputEmail" id="" placeholder={"Votre email"} className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4" />

                    <label htmlFor="inputPseudo" className="text-white block">Pseudo</label>
                    <input type="text" name="inputPseudo" id="" placeholder={"Votre pseudo"}className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4" />

                    <label htmlFor="inputPassword1" className="text-white block">Mot de passe</label>
                    <input type="password" name="inputPassword1" id="" placeholder={"Votre mot de passe"} className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4" />

                    <label htmlFor="inputPassword2" className="text-white block">Confirmez votre mot de passe</label>
                    <input type="password" name="inputPassword2" id="" placeholder={"Confirmez votre mot de passe"} className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4" />
                </div>
            </div>
                <br />
                <div className="fixed bottom-0 w-full text-center mb-16" style={{textAlign:"center"}}>
                    <button type="submit" className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-8 rounded-full border border-black">Se connecter</button>
                </div>
            </form>
        </div>
    )
  }