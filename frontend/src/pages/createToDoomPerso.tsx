import Header from "@/components/header"

export default function CreateToDoomPerso() {

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
                    <h1 className="font-bold text-lg ml-4 text-red-500 " style={skewStyleText}>Créez une nouvelle ToDoom perso</h1>
                </div>
            </div>

            <form action="">
                <div className="flex flex-col items-center" style={{marginTop:"50px"}}>
                    <label>Le titre de votre ToDoom</label>
                    <input
                        type="text"
                        name="inptNewTDTitle"
                        placeholder="Faire virement Paypal à Alexandre"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                    />
                </div>
                

                <div className="flex flex-col items-center" style={{marginTop:"25px"}}>
                    <label>Ajouter une description ?</label>
                    <input
                        type="text"
                        name="inptNewTDDescription"
                        placeholder="Un description facultative"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                    />
                </div>

                <div className="flex flex-col items-center" style={{marginTop:"25px"}}>
                    <label>La deadline de cette ToDoom</label>
                    <input
                        type="date"
                        name="inptNewTDDeadline"
                        min="2023-01-01" max="2050-12-31"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                    />
                </div>

                <div className="flex flex-col items-center" style={{marginTop:"25px"}}>
                    <label>Le statut de la ToDoom</label>
                    <select name="statusTD" className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4">
                        <option value="not_started">Pas commencé</option>
                        <option value="in_progress" >En cours</option>
                        <option value="done">Terminé</option>
                    </select>
                </div>
                    
                <button type="submit"
                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-8 rounded-full border border-black"
                    style={{display:"block", margin:"auto", marginTop:"1em", marginBottom:"2em"}}>
                    Créer le groupe
                </button>

            </form>

        </div>
    )

}