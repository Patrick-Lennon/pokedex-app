import { useEffect, useState } from 'react';
import type { Pokemon } from '../types.ts';

interface Props {
  name: string;
}

function PokemonInfo({ name }: Props) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [habitat, setHabitat] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      setError('');
      setPokemon(null);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!res.ok) throw new Error('Pokémon not found');
        const data = await res.json();
        setPokemon(data);

        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
        if (!speciesRes.ok) throw new Error('Failed to fetch species data');
        const speciesData = await speciesRes.json();
        setHabitat(speciesData.habitat?.name || 'unknown');
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [name]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!pokemon) return null;

  /*height is in decimeters, weight's in hectograms. need to convert*/
  const pHeightMetric = Math.ceil(pokemon.height * 0.1 *100)/100;
  const pHeightImperial = Math.ceil(pokemon.height * 0.1 * 3.281 *100)/100;
  const pWeightMetric = pokemon.weight * 100 * .001;
  const pWeightImperial = Math.ceil(pokemon.weight * 100 * 0.00220462 *100)/100;

  return (
    <div style={{ marginTop: '2rem' }}>
      <div>
        <button onClick={() => setUnit('imperial')} style={{ fontWeight: unit === 'imperial' ? 'bold' : 'normal' }}>
          Imperial
        </button>
        <button onClick={() => setUnit('metric')} style={{ fontWeight: unit === 'metric' ? 'bold' : 'normal' }}>
          Metric
        </button>
      </div>
      <h2>{pokemon.name.toUpperCase()}</h2>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
             
      <p>Height: {unit === 'imperial' ? `${pHeightImperial} ft` : `${pHeightMetric} m`}</p>
      <p>Weight: {unit === 'imperial' ? `${pWeightImperial} lbs` : `${pWeightMetric} g`}</p>
      <p>Type(s): {pokemon.types.map(t => t.type.name).join(', ')}</p>
      <p>Abilities: {pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
      <p>Habitat: {habitat}</p>
    </div>
  );
};

export default PokemonInfo;
