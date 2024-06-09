import { useEffect } from "react";
import { fetchData } from "./utils/functions/fetchData.ts";
import { SpeciesType } from "./utils/types/Species.ts";
import {PlanetType, PlanetWithFilmType} from "./utils/types/Planet.ts";
import PlanetCard from "./components/PlanetCard.tsx";
import {FilmType} from "./utils/types/Film.ts";
import {useStateContext} from "./utils/hooks/useStateManager.tsx";

function App() {
    const { state, dispatch } = useStateContext();
    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const planetsWithReptiles = async () => {
            try {

                // It seems all planet related to reptiles right now don't have any films
                // so because of that I choose another species to show my program work properly you can uncomment reptiles species and see the problem
                const reptilesList = ['mammal'];
                // const reptilesList = ['reptilian', 'reptile'];

                // fetching
                const [allPlanets, allSpecies,allFilms] = await Promise.all([
                    fetchData<PlanetType[]>(`${baseUrl}/planets`),
                    fetchData<SpeciesType[]>(`${baseUrl}/species`),
                    fetchData<FilmType[]>(`${baseUrl}/films`),
                ]);
                // get peoples with reptiles species
                const peopleUrls = allSpecies.filter(species => reptilesList.includes(species.classification)).map(species => species.people).flat();
                // find the planets through people urls
                const planets = allPlanets.filter(planet =>
                    planet?.residents.some(peopleUrl => peopleUrls.includes(peopleUrl))
                );
                // check the planet for having at least one movie
                 const planetsInFilms = planets.filter(planet => planet.films.length > 0);

                const updatedPlanetsList = planetsInFilms.map(planet => ({
                    name: planet.name,
                    climate: planet.climate,
                    population: Number(planet?.population ?? 0),
                    created: planet.created,
                    films: allFilms.filter(film =>
                        planet?.films.includes(film?.url)
                    ),
                }));

                dispatch({ type: 'SET_PLANETS_LIST', payload: updatedPlanetsList });
            } catch (error) {
                console.error('Error fetching species:', error);
            }
        };

        planetsWithReptiles();
    }, [dispatch, baseUrl]);

    return (
        <div className="min-h-screen bg-darkGray p-4 flex flex-col items-center justify-center">
            {state.planetsList.map((item: PlanetWithFilmType, index: number) => (
                <PlanetCard key={'planet-card-' + index} {...item} />
            ))}
        </div>
    );
}

export default App;
