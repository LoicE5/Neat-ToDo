import Header from "@/components/Header";
import Todoom from "@/components/Todoom";

export default function Workplace() {
    return (
        <div>
            <Header />
            <br />
            <br />
            <h1 style={{ fontWeight: 'bold', fontSize: '1.5em', marginLeft: '20px' }}>Vos ToDoom Perso</h1>
            <br />
            <Todoom title="Acheter des cadeaux de Noël" status="En cours"
                description="Faire les achats de Noël parce que là ça commence à être urgent" author="ValReault" deadline="2022-11-12" />

            <Todoom title="Faire les courses" status="Pas commencé"
                description="Ya plus rien dans le frigo, faut acheter des pates" author="ValReault" deadline="2023-11-23" />

            <Todoom title="Finir le projet ToDoom" status="Terminé"
                description="Finir ce super projet pour Dauphine avant début décembre" author="ValReault" deadline="2023-12-01" />

        </div>

    )

}