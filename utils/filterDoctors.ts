import { Doctor } from '../types';

/**
 * Normalizes Arabic text for comparison by removing diacritics and normalizing characters
 * Handles Unicode variations in Arabic text (e.g., "\u0631\u0645\u062f" matches "رمد")
 */
const normalizeArabicText = (text: string): string => {
  return text
    .trim()
    .toLowerCase()
    // Normalize Arabic characters
    .replace(/[أإآ]/g, 'ا')  // Normalize Alef variations
    .replace(/ة/g, 'ه')      // Normalize Teh Marbuta to Heh
    .replace(/[ىي]/g, 'ي')   // Normalize Yeh variations
    .replace(/[ؤئ]/g, 'ء')   // Normalize Hamza variations
    // Remove diacritics (Tashkeel)
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/[\u0670]/g, '')
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Filters doctors by title property
 * 
 * @param doctors - Array of doctor objects with id, name, title, specialty, clinics
 * @param searchTitle - The title string to search for (supports Arabic Unicode)
 * @returns Filtered array of doctors matching the searchTitle
 * 
 * @example
 * const ophthalmologists = filterDoctorsByTitle(doctors, "رمد");
 * // Returns all doctors with title containing "رمد" (Ophthalmology)
 */
export const filterDoctorsByTitle = (
  doctors: Doctor[],
  searchTitle: string
): Doctor[] => {
  // Input validation
  if (!Array.isArray(doctors)) {
    console.warn('Dorak: filterDoctorsByTitle expects an array of doctors');
    return [];
  }

  if (!searchTitle || typeof searchTitle !== 'string' || searchTitle.trim() === '') {
    console.warn('Dorak: searchTitle must be a non-empty string');
    return [];
  }

  // Normalize the search term for Unicode-safe comparison
  const normalizedSearch = normalizeArabicText(searchTitle);

  // Filter doctors using ES6+ filter method
  const filteredDoctors = doctors.filter((doctor) => {
    // Check if doctor has a title property
    if (!doctor.title || typeof doctor.title !== 'string') {
      return false;
    }

    // Normalize doctor's title for comparison
    const normalizedTitle = normalizeArabicText(doctor.title);

    // Check if normalized title includes the normalized search term
    return normalizedTitle.includes(normalizedSearch);
  });

  // Edge case: No matches found
  if (filteredDoctors.length === 0) {
    console.info(
      `Dorak: لم يتم العثور على أطباء باللقب "${searchTitle}". جرب البحث بكلمات مختلفة.`
    );
  }

  return filteredDoctors;
};

/**
 * Filters doctors by multiple criteria (title, specialty, name)
 * More comprehensive filtering function for advanced use cases
 * 
 * @param doctors - Array of doctor objects
 * @param filters - Object containing filter criteria
 * @returns Filtered array of doctors
 */
export const filterDoctors = (
  doctors: Doctor[],
  filters: {
    title?: string;
    specialty?: string;
    name?: string;
  }
): Doctor[] => {
  if (!Array.isArray(doctors)) {
    return [];
  }

  return doctors.filter((doctor) => {
    // Filter by title
    if (filters.title) {
      const normalizedSearch = normalizeArabicText(filters.title);
      const normalizedTitle = normalizeArabicText(doctor.title || '');
      if (!normalizedTitle.includes(normalizedSearch)) {
        return false;
      }
    }

    // Filter by specialty
    if (filters.specialty) {
      if (doctor.specialty !== filters.specialty) {
        return false;
      }
    }

    // Filter by name
    if (filters.name) {
      const normalizedSearch = normalizeArabicText(filters.name);
      const normalizedName = normalizeArabicText(doctor.name || '');
      if (!normalizedName.includes(normalizedSearch)) {
        return false;
      }
    }

    return true;
  });
};
