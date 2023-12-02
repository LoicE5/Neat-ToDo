import Header from "@/components/Header"
import Todoom from "@/components/Todoom"

import React, { useState } from 'react';

export default function GroupDetails() {

    const skewStyleContainer = {
        transform: 'skewX(-30deg)',
        transformOrigin: 'top right',
        width: '50%',
      }
    
    const skewStyleText = {
        transform: 'skewX(30deg)',
      }

      
    const [inputVisible, setInputVisible] = useState(false);
    const [textInput, setTextInput] = useState('');
    
    

    const toggleInput = () => {
        setInputVisible(!inputVisible);
    
        // If hiding the input, clear the text
        if (!inputVisible) {
          setTextInput('');
        }
      };
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
        // Requete pour le backend
        alert('Request backend: ' + textInput);
    
        // Vide et cache l'input
        setTextInput('');
        setInputVisible(false);
        }
    };
    
    return (
        <div>
            <Header />

            <div style={skewStyleContainer}>
                <div className="bg-gray-800 p-4" >
                    <h1 className="font-bold text-lg ml-4 text-red-500" style={skewStyleText}>Group Name</h1>
                </div>
            </div>
            <br />
            
            <div className="flex">
                
                <div className="flex-grow">

                    {/* LISTE DES TODOOM D'UN GROUPE */}

                    <Todoom deadline="01/01/2024" status="in_progress" 
                    title="Faire page détails" description="coder les fonctions nécessaires"
                    author="ValReault"></Todoom>
                    
                    <Todoom deadline="01/01/2024" status="in_progress" 
                    title="Faire page détails" description="coder les fonctions nécessaires"
                    author="ValReault"></Todoom>

                    <Todoom deadline="01/01/2024" status="in_progress" 
                    title="Faire page détails" description="coder les fonctions nécessaires"
                    author="ValReault"></Todoom>
                    
                    
                </div>

                
                <aside className="bg-gray-300 rounded-md p-4 items-center ml-auto w-20vw mr-4 border border-gray-800"
                style={{height:"50vh"}}
                >
                    <h3 style={{color:"red", fontWeight:"bold", textAlign:"center", marginBottom:"0.5em"}}>Group Name</h3>
                    <div className="flex space-x-4 justify-center">
                        <div 
                        // onClick={}
                        >
                            <img className="h-8 w-auto" src="trash.png" alt="trashIcon"/>
                        </div>
                        
                        <div
                        // onClick={}
                        >
                            <img className="h-8 w-auto" src="exitGroup.png" alt="exitGroupIcon" />
                        </div>
                        
                        <div
                        onClick={toggleInput}
                        className="cursor-pointer"
                        >
                            <img className="h-8 w-auto" src="add.png" alt="addUserInGroupIcon" />
                        </div>
                    </div>

                    {/* Div cachée qui s'active quand on clique sur l'icone Ajouter une personne dans le groupe */}
                    {inputVisible && (
                        <div className="mt-4 flex items-center justify-center">
                        <input
                            id="textInput"
                            className="border rounded px-2 py-1"
                            style={{width:"20vw"}}
                            type="text"
                            placeholder="Mail de la personne à ajouter"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    )}
                    
                    <br />
                    <div style={{textAlign:"center", overflowY:"auto"}}>
                        TODO Liste membres du groupes /!\
                    </div>
                </aside>
            </div>
            
            
            
        </div>
    )

}