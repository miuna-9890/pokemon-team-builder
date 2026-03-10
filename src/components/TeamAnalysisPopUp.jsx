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
                if (statsData.attack > statsData.specialAttack) {
                    attackerType = "physical";
                } else if (statsData.specialAttack > statsData.attack) {
                    attackerType = "special";
                } else {
                    attackerType = "balanced";
                }

                // check defensiveness
                let totalDefense = statsData.defense + statsData.specialDefense + statsData.hp;
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
                </div>
            </div>
        </div>
    );
}

export default TeamAnalysisPopUp;