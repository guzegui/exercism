const PLANETS = {
  earth: 1,
  mercury: 0.2408467,
  venus: 0.61519726,
  mars: 1.8808158,
  jupiter: 11.862615,
  saturn: 29.447498,
  uranus: 84.016846,
  neptune: 164.79132,
};

const indexPlanets = Object.keys(PLANETS);

const DAYS = 365.25;
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOURS = 60;
const SECONDS_IN_MINUTES = 60;
const MILLISECONDS_IN_SECONDS = 1000;

export function age(planet: string, seconds: number): number {
  const indexPlanet: number = indexPlanets.indexOf(planet);
  const extraCalc: number = Object.values(PLANETS)[indexPlanet];
const result: string =    (seconds / SECONDS_IN_MINUTES/ MINUTES_IN_HOURS/ HOURS_IN_DAY / DAYS / extraCalc).toFixed(2)
  return (parseFloat(result)
  );
}


   // expect(age('earth', 1000000000)).toEqual(31.69)
