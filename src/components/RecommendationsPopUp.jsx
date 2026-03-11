
const RecommendationsPopUp = ({ recommendations, onClose }) => {
    return (
        <div className="team-analysis-popup-overlay">
            <div className="team-analysis-popup">
                <div className="popUp-header">
                    <h1>Recommendations</h1>
                    <button onClick={onClose}>Close</button>
                </div>
                <div className="rec-section">
                    {recommendations &&
                    <>
                    {recommendations.typeWeaknesses.length > 0 && (
                            <div className="recommendation-typesWeaknesses">
                                <ul>
                                    {recommendations.typeWeaknesses.map(t => (<li key={t.text}>
                                            {t.text} <span className="rec-type"> {t.type}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p>Consider adding Pokémon with resistances to these types.</p>
                            </div>
                        )}

                        {recommendations.roleGaps.length > 0 && (
                            <div className="recommendation-roleGaps">
                                <ul>
                                    {recommendations.roleGaps.map(r => (<li key={r}>{r}</li>
                                    ))}
                                </ul>
                                <p>Consider adding Pokémon that can fill these roles.</p>
                            </div>
                        )}

                        {recommendations.speedGaps.length > 0 && (
                            <div className="recommendation-speedGaps">
                                <ul>
                                    {recommendations.speedGaps.map(s => (<li key={s}>{s}</li>
                                    ))}
                                </ul>
                                <p>Consider adding a fast Pokémon to improve your team's speed balance.</p>
                            </div>
                        )}

                    {recommendations.weakestPokemon !== null && (
                        <div className="recommendation-weakestPokemon">
                            <ul>
                                <h3>Weakest Pokémon</h3>
                                <p>{recommendations.weakestPokemon}</p>
                            </ul>
                        </div>
                    )}
                    </>
                    }
                </div>
            </div>
        </div>
    );
}
export default RecommendationsPopUp;