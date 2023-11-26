import Header from "@/components/header"
import Group from "@/components/group"

export default function Groups() {

    return (
        <div>
            <Header />
            <h1
                style={{
                    fontWeight: 'bold',
                    fontSize: '1.5em',
                    marginLeft: '20px'
                }}>
                Vos Groupes
            </h1>
            <br />
            <div style={{zIndex:"1"}}>
                <Group title="Nom Groupe 1" id="1"></Group>
                <Group title="Nom Groupe 2" id="2"></Group>
                <Group title="Nom Groupe 3" id="3"></Group>

                <Group title="Nom Groupe 1" id="1"></Group>
                <Group title="Nom Groupe 2" id="2"></Group>
                <Group title="Nom Groupe 3" id="3"></Group>

                {/* Div ci dessous permet de compenser la place pris par le footer,
                Pour pas que le dernier groupe de la liste se retrouve caché derrière */}
                <div style={{height:"10vh"}}></div>
            </div>
            
            
            <div className="fixed bottom-0 w-full bg-gradient-to-t from-white via-white to-transparent filter blur-1" style={{ height: "15vh" }}>
            </div>
            <button type="submit"
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-8 rounded-full border border-black"
                style={{
                position: "fixed",
                zIndex: "2",
                marginTop: "2em",
                bottom: "2em",
                left: "50%",
                transform: "translateX(-50%)",
                }}>
                Créer un groupe
            </button>
        </div>
    )

}