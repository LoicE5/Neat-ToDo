import Link from "next/link"

export default function Group(props) {
    return (
        // Il faudra remplacer la cible du lien
        <Link href="/workplace" style={{textDecoration:"none", color:"black"}}>
            <div style={{
            marginLeft: "7em", marginRight: "7em", marginBottom:"1.7em", paddingTop:"0.5em", borderRadius: "1em", height:"15vh", backgroundColor: "#D7D7D7", position:"relative"
            }}>
            
            <h3 className="mr-auto ml-8 text-lg font-bold">{props.title}</h3>
            <div className="flex justify-between">
                <p style={{marginLeft : "4em"}}>3 membres</p>
                {/* <Link href="#"> CRASH SI CE LINK */}
                    <div style={{display:"block", width:"2em", marginRight:"1em"}}>
                        <img src="exitGroup.png" alt="TrashIcon"/>
                    </div>
                {/* </Link> */}
                
            </div>
            <div style={{backgroundColor: "#706c6c", borderRadius: "10em", 
                position:"absolute",bottom: "0", width:"100%", height:"10px"}}></div>
        </div>

        </Link>
        
    )
  
}