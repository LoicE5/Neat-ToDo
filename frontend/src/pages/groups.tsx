import Header from "@/components/header"
import Group from "@/components/group"
import Link from "next/link"

export default function Groups() {

    const skewStyleContainer = {
        transform: 'skewX(-30deg)',
        transformOrigin: 'top right',
        width: '50%',
      }
    
    const skewStyleText = {
        transform: 'skewX(30deg)',
      }

    return (
        <div>
            <Header />

            <div style={skewStyleContainer}>
                <div className="bg-gray-800 p-4" >
                    <h1 className="font-bold text-lg ml-4 text-red-500 " style={skewStyleText}>Vos Groupes</h1>
                </div>
            </div>
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
            <Link href="/createGroup">
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
            </Link>
            
        </div>
    )

}