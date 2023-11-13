export default function Home() {
    return (
        <div style={{
            backgroundImage: `url("doom_eternal.jpg")`,
            backgroundSize: "cover",
            height: "100vh"
            }}>
            <img src="logoV1.png" alt="logo" style={{
                width: "20vw"
                }}
            />
            <button type="submit">Connexion</button>
            <a href="">Pas encore de compte</a>
          </div>
    )    
  }