
const RecommendationsPopUp = ({ recommendations, onClose }) => {
    return (
        <div className="team-analysis-popup-overlay">
            <div className="team-analysis-popup">
                <div className="popUp-header">
                    <h1>Recommendations</h1>
                    <button className="popUp-header-close" onClick={onClose}>&times;</button>
                </div>
                <div className="rec-section">
                    {recommendations &&
                    <>
                        <div className="recommendation-overview">
                    {recommendations.typeWeaknesses.length > 0 && (
                            <div className="recommendation-typesWeaknesses">
                                <h3>Duplicate Weaknesses</h3>
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
                                <h3>Role Gaps</h3>
                                <ul>
                                    {recommendations.roleGaps.map(r => (<li key={r}>{r}</li>
                                    ))}
                                </ul>
                                <p>Consider adding Pokémon that can fill these roles.</p>
                            </div>
                        )}
                        {recommendations.speedGaps.length > 0 && (
                            <div className="recommendation-speedGaps">
                                <h3>Speed Gaps</h3>
                                <ul>
                                    {recommendations.speedGaps.map(s => (<li key={s}>{s}</li>
                                    ))}
                                </ul>
                                <p>Consider adding a fast Pokémon to improve your team's speed balance.</p>
                            </div>
                        )}

                    {recommendations.weakestPokemon !== null && (
                        <div className="recommendation-weakestPokemon">
                                <h3>Weakest Pokémon</h3>
                                {recommendations.weakestPokemon.map(w => (
                                    <div key={w.text}>
                                        <p>{w.text}</p>
                                        <p>Consider replacing it with a stronger pokemon.</p>
                                        <img className="recommendation-weakestPokemon-img" src={w.pic} alt="weakest pokemon" />
                                    </div>
                                ))}
                        </div>
                    )}
                        </div>
                    </>
                    }
                </div>
            </div>
        </div>
    );
}
export default RecommendationsPopUp;