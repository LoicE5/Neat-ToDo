
export default function Home() {
    return (
        <div style={{
            backgroundImage: `url("doom_eternal.jpg")`,
            backgroundSize: "cover",
            height: "100vh"
            }}>
            <div style={{paddingLeft: "30vw",
                            paddingTop: "5%",
                            textAlign:"center"}}>
                <img src="logoV1.png" alt="logo" style={{
                    width: "20vw",
                    margin:"auto",
                    display:"block"
                    }}
                />
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" style={{
                    marginTop: "2em"
                    }}
                >Connexion</button>
                <br />
                <a href="" style={{
                    marginTop: "2em"
                    }}>Pas encore de compte ?</a>
            </div>
            
          </div>
    )    
  }