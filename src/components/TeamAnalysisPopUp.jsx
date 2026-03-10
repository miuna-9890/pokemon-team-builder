// reusable component to display team analysis data in a pop-up modal

import React, {useEffect, useState} from 'react';

const TeamAnalysisPopUp = ({team, onClose }) => {
    const [typeData, setTypeData] = useState(null)
    const [statsData, setStatsData] = useState(null)

    // Function to fetch team analysis data from the backend API
    useEffect(() => {
        const fetchData = async () => {
            const teamTypes = team.flatMap(p => p.types.map(t => t.type.name));

            const typeData = await Promise.all(
                teamTypes.map(type =>
                    fetch(`https://pokeapi.co/api/v2/type/${type}`).then(res => res.json()))
            );

            const weak = {}
            const veryWeak = {}
            const strong = {}
            const veryStrong = {}
            const resistant = {}

            typeData.forEach(type => {
                type.damage_relations.double_damage_from.forEach(t => {
                    veryWeak[t.name] = (veryWeak[t.name] || 0) + 1
                })
                type.damage_relations.double_damage_to.forEach(t => {
                    veryStrong[t.name] = (veryStrong[t.name] || 0) + 1
                })
                type.damage_relations.half_damage_from.forEach(t => {
                    weak[t.name] = (weak[t.name] || 0) + 1
                })
                type.damage_relations.half_damage_to.forEach(t => {
                    strong[t.name] = (strong[t.name] || 0) + 1
                })
                type.damage_relations.no_damage_from.forEach(t => {
                    resistant[t.name] = (resistant[t.name] || 0) + 1
                })
            })

            setTypeData({weak, veryWeak, strong, veryStrong, resistant})
        };
        fetchData();
    }, [team]);

    // Function to analyze the stats of the team and categorize them based on their roles and speed
    useEffect(() => {
        // get the stats for each pokemon and their value for comparison
        const fetchStats = async () => {
            const stats = team.map(p => {
                const statsData = p.stats.reduce((acc, s) => {
                    acc[s.stat.name] = s.base_stat
                    return acc
                }, {})

                // check AttackerType
                let attackerType = "";
                if (statsData.attack > statsData['special-attack']) {
                    attackerType = "physical";
                } else if (statsData['special-attack'] > statsData.attack) {
                    attackerType = "special";
                } else {
                    attackerType = "balanced";
                }

                // check defensiveness
                let totalDefense = statsData.defense + statsData['special-defense'] + statsData.hp;
                let role = "";
                if (totalDefense > 100) {
                    role = "defensive"
                } else {
                    role = "offensive"
                }

                // speed distribution
                let speedRole = "";
                if (statsData.speed > 100) {
                    speedRole = "fast";
                } else if (statsData.speed < 50) {
                    speedRole = "slow";
                } else {
                    speedRole = "average";
                }

                return {name: p.name, attackerType, role, speedRole}
            })

            //summarize the stats data for the team
            const summary = {
                physical: { count: 0, pokemons: [] },
                special: { count: 0, pokemons: [] },
                balanced: { count: 0, pokemons: [] },
                defensive: { count: 0, pokemons: [] },
                offensive: { count: 0, pokemons: [] },
                fast: { count: 0, pokemons: [] },
                average: { count: 0, pokemons: [] },
                slow: { count: 0, pokemons: [] },
            }

            stats.forEach(s => {
                summary[s.attackerType].count += 1
                summary[s.attackerType].pokemons.push(s.name)

                summary[s.role].count += 1
                summary[s.role].pokemons.push(s.name)

                summary[s.speedRole].count += 1
                summary[s.speedRole].pokemons.push(s.name)
            })

            // set the stats data for the team
            setStatsData(summary)
        }
        fetchStats();
    }, [team]);

    // Identify the weakest Pokémon in the team based on their total base stats
    const weakestPokemon = team.map(p => ({
        name: p.name,
        totalStats: p.stats.reduce((acc, s) => acc + s.base_stat, 0),
    })).sort((a, b) => a.totalStats - b.totalStats)[0];

    // Function to generate recommendations based on the type and stats analysis of the team
    const generateRecommendations = () => {
        const recommendations = [];
        const combinedWeaknesses = {};
        Object.entries(typeData.veryWeak).forEach(([type, count]) => {
            combinedWeaknesses[type] = (combinedWeaknesses[type] || 0) + count;
        });

        Object.entries(typeData.weak).forEach(([type, count]) => {
            combinedWeaknesses[type] = (combinedWeaknesses[type] || 0) + count;
        });

        Object.entries(combinedWeaknesses).sort((a, b) => b[1] - a[1]).
            forEach(([type, count]) => {
            if (count >= 3) {
                recommendations.push('Your team has a major weakness to ' + type + ': Consider adding Pokémon that resist ' + type);
            } else if (count > 1) {
                recommendations.push('Several Pokémon weak to ' + type + ': Consider removing some or adding Pokémon that resist ' + type);
            }
        });

        if (statsData.physical.count === 0) {
            recommendations.push('No physical attackers');
        }
        if (statsData.special.count === 0) {
            recommendations.push('No special attackers');
        }
        if (statsData.defensive.count === 0) {
            recommendations.push('No defensive Pokémon');
        }
        if (statsData.offensive.count === 0) {
            recommendations.push('No offensive Pokémon');
        }
        if (statsData.fast.count === 0) {
            recommendations.push('No fast Pokémon');
        }

        if (weakestPokemon && team.length > 1) {
            recommendations.push(`Your weakest Pokémon is ${weakestPokemon.name} with the lowest base stats of ${weakestPokemon.totalStats}. Consider replacing to improve overall strength.`);
        }
        return recommendations;
    }
    const recommendations = typeData && statsData ? generateRecommendations() : [];

    if (!typeData || !statsData) return <div className="team-analysis-popup-overlay">Loading analysis...</div>;

    return (
        <div className="team-analysis-popup-overlay">
            <div className="team-analysis-popup">
                <div className="popUp-header">
                    <h1>Team Analysis</h1>
                    <button onClick={onClose}>Close</button>
                </div>

                <div className="team-analysis-content">
                    <div className="analysis-section">
                        <h2>Type coverage</h2>
                        <h3>Very Weak Against</h3>
                        <ul>
                            {Object.entries(typeData.veryWeak).map(([type, count]) => (
                                <li key={type}>{type} (x{count})</li>
                            ))}
                        </ul>
                        <h3>Weak Against</h3>
                        <ul>
                            {Object.entries(typeData.weak).map(([type, count]) => (
                                <li key={type}>{type} (x{count})</li>
                            ))}
                        </ul>
                        <h3>Very Strong Against</h3>
                        <ul>
                            {Object.entries(typeData.veryStrong).map(([type, count]) => (
                                <li key={type}>{type} (x{count})</li>
                            ))}
                        </ul>
                        <h3>Strong Against</h3>
                        <ul>
                            {Object.entries(typeData.strong).map(([type, count]) => (
                                <li key={type}>{type} (x{count})</li>
                            ))}
                        </ul>
                        <h3>Resistant Against</h3>
                        <ul>
                            {Object.entries(typeData.resistant).map(([type, count]) => (
                                <li key={type}>{type} (x{count})</li>
                            ))}
                        </ul>
                    </div>

                    <div className="analysis-section">
                        <h2>Role coverage</h2>
                        <h3>Attacker Type Distribution</h3>
                        <ul>
                            {Object.entries(statsData).filter(([key]) => ['physical', 'special', 'balanced'].includes(key)).map(([type, data]) => (
                                <li key={type}>{type} ({data.count}): {data.pokemons.join(', ')}</li>
                            ))}
                        </ul>
                        <h3>Role Distribution</h3>
                        <ul>
                            {Object.entries(statsData).filter(([key]) => ['defensive', 'offensive'].includes(key)).map(([type, data]) => (
                                <li key={type}>{type} ({data.count}): {data.pokemons.join(', ')}</li>
                            ))}
                        </ul>
                        <h3>Speed Distribution</h3>
                        <ul>
                            {Object.entries(statsData).filter(([key]) => ['fast', 'average', 'slow'].includes(key)).map(([type, data]) => (
                                <li key={type}>{type} ({data.count}): {data.pokemons.join(', ')}</li>
                            ))}
                        </ul>

                    </div>

                    <div className="analysis-section">
                        <h2>Recommendations</h2>
                        {recommendations.length > 0 ? (
                            <ul>
                                {recommendations.map((rec, index) => (
                                    <li key={index}>{rec}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>Your team has good type and role coverage!</p>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamAnalysisPopUp;