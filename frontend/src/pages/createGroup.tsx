import Header from "@/components/Header"
import { userGetResponse } from "@/utils/interfaces";
import storage from "@/utils/storage";

export default function CreateGroup() {
    const user = storage.user.load() as userGetResponse

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
                <div className="flex flex-col items-center" style={{ marginTop: "50px" }}>
                    <label>Nom de votre groupe</label>
                    <input
                        type="text"
                        name="inputNewGroupName"
                        placeholder="Projet Todoom, Département IT..."
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                    />
                </div>


                <div className="flex flex-col items-center" style={{ marginTop: "25px" }}>
                    <label htmlFor="email">Premier membre du groupe</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="jean.dupont@dauphine.eu"
                        className="mx-auto w-1/3 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mb-4"
                        value={user.email}
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