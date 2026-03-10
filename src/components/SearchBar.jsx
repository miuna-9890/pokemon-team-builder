//implementation of the search bar component that allows users to search for Pokémons

import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    // State to hold the current input value
    const [pokemon, setPokemon] = useState('');

    // Handler for input change to update the state
    const handleInputChange = (e) => {
        setPokemon(e.target.value);
    };

    const handleSearch = () => {
        onSearch(pokemon);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search for a Pokémon..."
                value={pokemon}
                onChange={handleInputChange}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
}

export default SearchBar;