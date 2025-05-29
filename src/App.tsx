import { useEffect, useState } from 'react';
import PokemonInfo from './components/PokemonInfo.tsx';

function App() {
  const [pokemonName, setPokemonName] = useState('');
  const [query, setQuery] = useState('');
  const [pokemonList, setPokemonList] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Fetch all Pokémon names
  useEffect(() => {
    const fetchPokemonNames = async () => {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
      const data = await res.json();
      setPokemonList(data.results.map((p: { name: string }) => p.name));
    };
    fetchPokemonNames();
  }, []);

  // Update suggestions as user types
  useEffect(() => {
    const input = pokemonName.toLowerCase();
    if (input.length > 0) {
  const filtered = pokemonList.filter(name =>
    name.startsWith(input) && name !== input
  );
  setSuggestions(filtered.slice(0, 5)); /* imprtant so when there's only 1 name it doesn't display */
}else {
      setSuggestions([]);
    }
  }, [pokemonName, pokemonList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(pokemonName.toLowerCase().trim());
    setSuggestions([]);
  };

  const handleSelect = (name: string) => {
    setPokemonName(name);
    setQuery(name);
    setSuggestions([]);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Patrick Pokédex</h1>
      <form onSubmit={handleSubmit} style={{ position: 'relative', display: 'inline-block' }}>
        <input
          type="text"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          placeholder="Enter Pokémon name"
          style={{ padding: '8px', width: '250px' }}
        />
        <button type="submit">Search</button>
        {suggestions.length > 0 && (
          <ul style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '100%',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            width: '100%',
            zIndex: 10,
          }}>
            {suggestions.map((name, i) => (
              <li
                key={i}
                onClick={() => handleSelect(name)}
                style={{ padding: '8px', cursor: 'pointer', color: 'black' }}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </form>
      {query && <PokemonInfo name={query} />}
    </div>
  );
}

export default App;
