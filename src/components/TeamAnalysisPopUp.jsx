// reusable component to display team analysis data in a pop-up modal

import React, {useEffect, useState} from 'react';

const TeamAnalysisPopUp = ({team, onClose }) => {
    const [analysisData, setAnalysisData] = useState(null)

    // Function to fetch team analysis data from the backend API
    useEffect(() => {
        const fetchTypesData = async () => {
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

            setAnalysisData({weak, veryWeak, strong, veryStrong, resistant})
        };

        fetchTypesData();
    }, [team]);

    if (!analysisData) return <div className="team-analysis-popup-overlay">Loading analysis...</div>;

    return (
        <div className="team-analysis-popup-overlay">
            <div className="team-analysis-popup">
                <h2>Team Analysis</h2>
                <button onClick={onClose}>Close</button>
                <div className="analysis-section">
                    <h3>Very Weak Against</h3>
                    <ul>
                        {Object.entries(analysisData.veryWeak).map(([type, count]) => (
                            <li key={type}>{type} (x{count})</li>
                        ))}
                    </ul>
                    <h3>Weak Against</h3>
                    <ul>
                        {Object.entries(analysisData.weak).map(([type, count]) => (
                            <li key={type}>{type} (x{count})</li>
                        ))}
                    </ul>
                    <h3>Very Strong Against</h3>
                    <ul>
                        {Object.entries(analysisData.veryStrong).map(([type, count]) => (
                            <li key={type}>{type} (x{count})</li>
                        ))}
                    </ul>
                    <h3>Strong Against</h3>
                    <ul>
                        {Object.entries(analysisData.strong).map(([type, count]) => (
                            <li key={type}>{type} (x{count})</li>
                        ))}
                    </ul>
                    <h3>Resistant Against</h3>
                    <ul>
                        {Object.entries(analysisData.resistant).map(([type, count]) => (
                            <li key={type}>{type} (x{count})</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default TeamAnalysisPopUp;