// reusable component to display pokemon data and add/remove from team

function PokemonCard({ pokemon, onAddToTeam, onRemoveFromTeam, isInTeam }) {
    return (
        <div className="pokemon-card">
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <h2>{pokemon.name.toUpperCase()}</h2>

            <div className="pokemon-types">
                <strong>Types: </strong>
                {pokemon.types.map(t => (
                    <span key={t.type.name} className={`type ${t.type.name}`}>
                        {t.type.name}
                    </span>
                ))}
            </div>


            <div className="pokemon-abilities">
                <p>
                <strong>Abilities: </strong>
                {pokemon.abilities.map(a => a.ability.name).join(', ')}
                </p>
            </div>

            <div className="pokemon-stats">
                <strong>Stats:</strong>
                {pokemon.stats.map(s => (
                    <p key ={s.stat.name}>
                        {s.stat.name}: {s.base_stat}
                    </p>
                ))}
            </div>
            {isInTeam ? (
                <button onClick={() => onRemoveFromTeam(pokemon)}> ❌ Remove from Team</button>
            ) : (
                <button onClick={() => onAddToTeam(pokemon)}> ➕ Add to Team</button>
            )}
        </div>
    );
}

export default PokemonCard;