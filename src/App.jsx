import { useState } from 'react'
import SearchBar from './components/SearchBar'
import PokemonCard from "./components/PokemonCard.jsx";
import TeamAnalysisPopUp from "./components/TeamAnalysisPopUp.jsx";
import './App.css'
import './styles/PokemonCard.css'
import './styles/TeamAnalysisPopUp.css'
import './styles/SearchBar.css'
import toast, {Toaster} from "react-hot-toast";

function App() {
    const [pokemonData, setPokemonData] = useState(null)
    const [team, setTeam] = useState([]) // State to hold the user's Pokémon team(up to 6)
    const [showAnalysis, setShowAnalysis] = useState(false) // State to control the visibility of the team analysis pop-up

    // Function to handle searching for a Pokémon by name
    const handleSearch = async (pokemon) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`)
            if (!response.ok) {
                toast.error('Pokémon not found')
                throw new Error('Pokémon not found')

            }
            const data = await response.json()
            setPokemonData(data)
        } catch (error) {
            console.error(error)
            setPokemonData(null)
        }
    };

    // Function to handle adding a Pokémon to the user's team
    const handleAddToTeam = (pokemon) => {
        if (team.length >= 6) {
            toast.error('Team is full! You can only have 6 Pokémon.')
            return;
        }

        if (team.find(p => p.name === pokemon.name)) {
            toast.error(`${pokemon.name} is already in your team!`)
            return;
        }

        setTeam([...team, pokemon])
        toast.success(`${pokemon.name} added to your team!`)
    };

    // Function to handle removing a Pokémon from the user's team
    const handleRemoveFromTeam = (pokemon) => {
        setTeam(team.filter(p => p.name !== pokemon.name))
        toast.success(`${pokemon.name} removed from your team!`)
    };

    return (
        <div className="app-container">
            <Toaster />

            <div className="main-panel">
            <h1>Pokémon Team Builder</h1>

            <SearchBar onSearch={handleSearch}/>

            {pokemonData && (
                <PokemonCard
                    pokemon={pokemonData}
                    onAddToTeam={handleAddToTeam}
                    onRemoveFromTeam={handleRemoveFromTeam}
                    isInTeam={team.some(p => p.name === pokemonData.name)}
                    />
            )}
        </div>

            <div className="team-panel">
                <h2>Your Team ({team.length}/6)</h2>

                <div className="team-panel-cards">
                {team.map(pokemon => (
                    <PokemonCard
                        key={pokemon.name}
                        pokemon={pokemon}
                        onRemoveFromTeam={handleRemoveFromTeam}
                        isInTeam={true}
                    />
                ))}
                </div>

                {team.length > 0 && (
                    <button onClick={() => setShowAnalysis(true)}>Analyze your team</button>
                )}

                {showAnalysis && (
                    <TeamAnalysisPopUp
                        team={team}
                        onClose={() => setShowAnalysis(false)}
                    />
                )}
            </div>

        </div>

    );
}

export default App
