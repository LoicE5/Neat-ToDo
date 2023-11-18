export default function ToDoom(props:any){
    let showStatus;
    switch (props.status) {
        case "Pas commencé":
            showStatus = <p className="ml-auto italic text-white">Pas commencé</p>;
            break;
        
        case "En cours":
            showStatus = <p className="ml-auto italic text-blue-300">En cours</p>;
            break;
        
        case "Terminé":
            showStatus = <p className="ml-auto italic text-green-500">Terminé</p>;
            break;
        default:
            showStatus = <p className="ml-auto italic text-white">Statut inconnu</p>;
            break;
    }
    let deadline = new Date(props.deadline)
    let todayDate = new Date()
    let late = null
    if (deadline<todayDate && props.status != "Terminé") {
        late = <p className="mr-2 font-bold text-red-500">EN RETARD</p>
    }

    return(
        <div className="rounded p-4 text-white" style={{margin:"2em", backgroundColor:"#706c6c", borderRadius:"1em"
        }}>
            <div className="flex">
                <h3 className="mr-auto text-lg font-bold">{ props.title }</h3>
                <div className="flex">
                    {late}
                    {showStatus}
                </div>
                
            </div>
            <div>
                <p className="ml-10">{ props.description }</p>
            </div>
            <div className="flex">
                <p className="mr-auto">{ props.author }</p>
                <p className="ml-auto">{deadline.getDate()}/{deadline.getMonth()+1}/{deadline.getFullYear()}</p>
            </div>
        </div>
    )
}