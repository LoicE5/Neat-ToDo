import Header from "@/components/header"

export default function CreateGroup() {

    const skewStyleContainer = {
        transform: 'skewX(-30deg)',
        transformOrigin: 'top right',
        width: '50%',
      };
    
    const skewStyleText = {
        transform: 'skewX(30deg)',
      }

    return (
        <div>
            <Header />
            <div style={skewStyleContainer}>
                <div className="bg-gray-800 p-4" >
                    <h1 className="font-bold text-lg ml-4 text-red-500 " style={skewStyleText}>Créez votre nouveau groupe</h1>
                </div>
            </div>

            <form action="">
                <div className="flex flex-col items-center" style={{marginTop:"50px"}}>
                    <label>Le nom de votre groupe</label>
                    <input
                        type="text"
                        name="inputNewGroupName"
                        placeholder="Le nom"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                    />
                </div>
                

                <div className="flex flex-col items-center" style={{marginTop:"25px"}}>
                    <label htmlFor="email">Le mail de la personne à ajouter</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Personne à ajouter"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                    />
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
                    Créer le groupe
                </button>

            </form>

        </div>
    )

}