// reusable component to display pokemon data and add/remove from team

function PokemonCard({ pokemon, onAddToTeam, onRemoveFromTeam, isInTeam }) {
    return (
        <div className="pokemon-info">
            <h2>{pokemon.name.toUpperCase()}</h2>
            <p>Type: {pokemon.types.map(t => t.type.name).join(', ')}</p>
            <p>Abilities: {pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
            <p>Stats: {pokemon.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join(', ')}</p>
            {isInTeam ? (
                <button onClick={() => onRemoveFromTeam(pokemon)}>Remove from Team</button>
            ) : (
                <button onClick={() => onAddToTeam(pokemon)}>Add to Team</button>
            )}
        </div>
    );
}

export default PokemonCard;