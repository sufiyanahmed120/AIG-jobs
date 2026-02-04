import { categories, locations } from './mockData';

// Common job roles for autocomplete
export const jobRoles = [
  'Software Engineer',
  'Finance Manager',
  'Marketing Manager',
  'HR Manager',
  'Accountant',
  'Sales Executive',
  'Project Manager',
  'Business Analyst',
  'Data Analyst',
  'Graphic Designer',
  'Architect',
  'Civil Engineer',
  'Mechanical Engineer',
  'Electrical Engineer',
  'Nurse',
  'Teacher',
  'Chef',
  'Operations Manager',
  'Customer Service',
  'Administrator',
];

// Get all cities for location autocomplete
export const allCities = Object.entries(locations).flatMap(([country, cities]) =>
  cities.map(city => ({ city, country }))
);

// Autocomplete suggestions for job roles
export function getJobRoleSuggestions(query: string): string[] {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return jobRoles
    .filter(role => role.toLowerCase().includes(lowerQuery))
    .slice(0, 5);
}

// Autocomplete suggestions for locations
export function getLocationSuggestions(query: string): Array<{ city: string; country: string; display: string }> {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  const results: Array<{ city: string; country: string; display: string }> = [];
  
  // Search cities
  allCities.forEach(({ city, country }) => {
    if (city.toLowerCase().includes(lowerQuery)) {
      results.push({ city, country, display: `${city}, ${country}` });
    }
  });
  
  // Search countries
  Object.keys(locations).forEach(country => {
    if (country.toLowerCase().includes(lowerQuery) && !results.some(r => r.country === country)) {
      results.push({ city: '', country, display: country });
    }
  });
  
  return results.slice(0, 5);
}
