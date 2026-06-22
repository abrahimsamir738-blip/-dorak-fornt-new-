/**
 * Example Usage of filterDoctorsByTitle Function
 * 
 * This file demonstrates how to use the filterDoctorsByTitle function
 * when a user clicks on a specialty category in the UI.
 */

import { Doctor } from '../types';
import { filterDoctorsByTitle, filterDoctors } from './filterDoctors';
import { SpecialtyType } from '../types';

// Example 1: Basic usage - Filter doctors by title
export const exampleBasicFilter = (doctors: Doctor[]) => {
 // Filter doctors with title containing "رمد" (Ophthalmology)
 const ophthalmologists = filterDoctorsByTitle(doctors, "رمد");

 console.log(`Found ${ophthalmologists.length} ophthalmologists`);
 return ophthalmologists;
};

// Example 2: Filter when user clicks on specialty category
export const handleSpecialtyCategoryClick = (
 doctors: Doctor[],
 specialtyLabel: string
): Doctor[] => {
 /**
  * This function is called when a user clicks on a specialty category
  * (e.g., clicking on "رمد" card in the specialties section)
  * 
  * @param doctors - Array of all doctors
  * @param specialtyLabel - The Arabic label of the specialty (e.g., "رمد", "عظام")
  * @returns Filtered array of doctors matching the specialty title
  */

 // Filter doctors whose title contains the specialty label
 const filtered = filterDoctorsByTitle(doctors, specialtyLabel);

 // Log result for debugging
 if (filtered.length > 0) {
  console.log(`Dorak: تم العثور على ${filtered.length} طبيب في تخصص "${specialtyLabel}"`);
 }

 return filtered;
};

// Example 3: Integration with React component
export const useFilteredDoctors = (
 doctors: Doctor[],
 selectedSpecialty: SpecialtyType | null,
 specialtyLabel: string | null
) => {
 /**
  * React hook example for filtering doctors
  * This can be used in a component when specialty is selected
  */

 if (!selectedSpecialty || !specialtyLabel) {
  return doctors;
 }

 // Filter by title when specialty is selected
 return filterDoctorsByTitle(doctors, specialtyLabel);
};

// Example 4: Advanced filtering with multiple criteria
export const exampleAdvancedFilter = (doctors: Doctor[]) => {
 /**
  * Example of using the comprehensive filterDoctors function
  * This allows filtering by multiple criteria simultaneously
  */

 const results = filterDoctors(doctors, {
  title: "رمد",        // Filter by title containing "رمد"
  specialty: SpecialtyType.OPHTHALMOLOGY,  // Filter by specialty enum
  name: "أحمد"        // Filter by name containing "أحمد"
 });

 return results;
};

// Example 5: Real-world usage in Home component
export const exampleHomeComponentUsage = () => {
 /**
  * This is how you would use it in the Home.tsx component
  * when a user clicks on a specialty card
  */

 return `
    // In Home.tsx component:
    
    const handleSpecialtyClick = (type: SpecialtyType) => {
      const specialtyLabel = SPECIALTY_LABELS[type]; // e.g., "رمد"
      
      // Filter doctors by title
      const filteredDoctors = filterDoctorsByTitle(doctors, specialtyLabel);
      
      // Navigate to doctors page with filtered results
      navigate(\`/doctors?specialty=\${type}\`);
      
      // Or update state with filtered doctors
      setFilteredDoctors(filteredDoctors);
    };
  `;
};

// Example 6: Unicode handling demonstration
export const exampleUnicodeHandling = () => {
 /**
  * Demonstrates that the function correctly handles Unicode
  * Both "\u0631\u0645\u062f" and "رمد" will match
  */

 const doctors: Doctor[] = [
  {
   id: '1',
   name: 'د. أحمد',
   title: 'استشاري رمد',  // Contains "رمد"
   specialty: SpecialtyType.OPHTHALMOLOGY,
   // ... other properties
  } as Doctor
 ];

 // Both of these will match:
 const result1 = filterDoctorsByTitle(doctors, "رمد");
 const result2 = filterDoctorsByTitle(doctors, "\u0631\u0645\u062f");

 console.log('Unicode test - both should match:', result1.length === result2.length);

 return { result1, result2 };
};
