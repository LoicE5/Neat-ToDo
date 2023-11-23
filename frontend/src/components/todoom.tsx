interface ToDoomProps {
    deadline: Date | string,
    status: string,
    title: string,
    description: string,
    author: string
}

export default function ToDoom({ deadline, status, title, description, author }: ToDoomProps) {
    let showStatus;
    switch (status) {
        case "Pas commencé":
            showStatus = <p className="ml-auto italic text-white">Pas commencé</p>
            break;

        case "En cours":
            showStatus = <p className="ml-auto italic text-blue-300">En cours</p>
            break;

        case "Terminé":
            showStatus = <p className="ml-auto italic text-green-500">Terminé</p>
            break;
        default:
            showStatus = <p className="ml-auto italic text-white">Statut inconnu</p>
            break;
    }
    
    if (!(deadline instanceof Date))
        deadline = new Date(deadline)

    let todayDate = new Date()
    let late = null

    if (deadline < todayDate && status != "Terminé") 
        late = <p className="mr-2 font-bold text-red-500">EN RETARD</p>
    
    return (
        <div className="rounded p-4 text-white" style={{
            margin: "2em", backgroundColor: "#706c6c", borderRadius: "1em"
        }}>
            <div className="flex">
                <h3 className="mr-auto text-lg font-bold">{title}</h3>
                <div className="flex">
                    {late}
                    {showStatus}
                </div>

            </div>
            <div>
                <p className="ml-10">{description}</p>
            </div>
            <div className="flex">
                <p className="mr-auto">{author}</p>
                <p className="ml-auto">{deadline.getDate()}/{deadline.getMonth() + 1}/{deadline.getFullYear()}</p>
            </div>
        </div>
    )
}