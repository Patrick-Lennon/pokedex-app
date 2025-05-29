import { useState } from 'react';
import PokemonInfo from './components/PokemonInfo.tsx';

function App() {
  const [pokemonName, setPokemonName] = useState('');
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(pokemonName.toLowerCase().trim());
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Pokémon Info Viewer</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          placeholder="Enter Pokémon name"
        />
        <button type="submit">Search</button>
      </form>
      {query && <PokemonInfo name={query} />}
    </div>
  );
}

export default App;
