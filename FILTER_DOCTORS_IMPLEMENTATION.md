# Filter Doctors by Title - Implementation Guide

## Overview

This document describes the implementation of the `filterDoctorsByTitle` function for the Dorak app, which filters doctors based on their title property with proper Unicode/Arabic string handling.

## Files Created/Modified

### 1. `website/utils/filterDoctors.ts`
Main filtering utility file containing:
- `filterDoctorsByTitle()` - Primary function for filtering by title
- `filterDoctors()` - Advanced multi-criteria filtering
- `normalizeArabicText()` - Unicode normalization helper

### 2. `website/utils/filterDoctors.example.ts`
Example usage file demonstrating various use cases

### 3. Modified Files
- `website/Home.tsx` - Integrated filter function in specialty click handler
- `website/pages/DoctorsPage.tsx` - Enhanced filtering logic using the new function

## Function Signature

```typescript
filterDoctorsByTitle(doctors: Doctor[], searchTitle: string): Doctor[]
```

### Parameters
- `doctors`: Array of doctor objects with structure:
  ```typescript
  {
    id: string;
    name: string;
    title: string;      // The property we filter by
    specialty: SpecialtyType;
    clinics: Branch[];
    // ... other properties
  }
  ```
- `searchTitle`: String to search for in doctor titles (supports Arabic Unicode)

### Returns
- Filtered array of doctors whose `title` property contains the `searchTitle`
- Empty array if no matches found (with console message)

## Key Features

### 1. Unicode/Arabic Handling
The function correctly handles Arabic Unicode variations:
- `"\u0631\u0645\u062f"` matches `"رمد"`
- Normalizes Alef variations (أ, إ, آ → ا)
- Normalizes Yeh variations (ى, ي → ي)
- Removes diacritics (Tashkeel)
- Case-insensitive matching

### 2. Edge Cases
- Returns empty array if no matches
- Logs friendly Arabic console message when no results
- Validates input parameters
- Handles missing or invalid title properties

### 3. Performance
- Uses ES6+ `filter()` method
- Efficient string normalization
- No unnecessary iterations

## Usage Examples

### Example 1: Basic Usage

```typescript
import { filterDoctorsByTitle } from './utils/filterDoctors';

const doctors = [
  { id: '1', name: 'د. أحمد', title: 'استشاري رمد', ... },
  { id: '2', name: 'د. سارة', title: 'استشاري عظام', ... }
];

// Filter doctors with title containing "رمد"
const ophthalmologists = filterDoctorsByTitle(doctors, "رمد");
// Returns: [{ id: '1', name: 'د. أحمد', title: 'استشاري رمد', ... }]
```

### Example 2: Clicking Specialty Category

```typescript
// In Home.tsx or similar component
import { filterDoctorsByTitle } from './utils/filterDoctors';
import { SPECIALTY_LABELS } from './constants';

const handleSpecialtyClick = (type: SpecialtyType) => {
  const specialtyLabel = SPECIALTY_LABELS[type]; // e.g., "رمد"
  
  // Filter doctors by title when user clicks specialty
  const filteredDoctors = filterDoctorsByTitle(doctors, specialtyLabel);
  
  console.log(`Found ${filteredDoctors.length} doctors with title "${specialtyLabel}"`);
  
  // Navigate to doctors page or update state
  navigate(`/doctors?specialty=${type}`);
};
```

### Example 3: Unicode Matching

```typescript
// Both of these will match doctors with title containing "رمد"
const result1 = filterDoctorsByTitle(doctors, "رمد");
const result2 = filterDoctorsByTitle(doctors, "\u0631\u0645\u062f");

// result1.length === result2.length (both match the same doctors)
```

### Example 4: Integration in React Component

```typescript
import { useMemo } from 'react';
import { filterDoctorsByTitle } from './utils/filterDoctors';

const DoctorsPage = ({ doctors, searchTerm }) => {
  const filteredDoctors = useMemo(() => {
    if (!searchTerm) return doctors;
    
    // Use filterDoctorsByTitle for title-based search
    return filterDoctorsByTitle(doctors, searchTerm);
  }, [doctors, searchTerm]);
  
  return (
    <div>
      {filteredDoctors.map(doctor => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};
```

## Integration Points

### 1. Home Component (`website/Home.tsx`)
When a user clicks on a specialty card:
```typescript
const handleSpecialtyClick = (type: string) => {
  const spec = type as SpecialtyType;
  setSelectedSpecialty(spec);
  
  // Filter doctors by specialty title
  const specialtyLabel = SPECIALTY_LABELS[spec];
  if (specialtyLabel) {
    const filteredByTitle = filterDoctorsByTitle(doctors, specialtyLabel);
    console.log(`Dorak: Found ${filteredByTitle.length} doctors with title matching "${specialtyLabel}"`);
  }
  
  navigate(`/doctors?specialty=${spec}`);
};
```

### 2. Doctors Page (`website/pages/DoctorsPage.tsx`)
Enhanced filtering logic that combines:
- Specialty filtering
- Title-based filtering (using `filterDoctorsByTitle`)
- General search filtering

## Testing

### Test Cases

1. **Basic Match**
   ```typescript
   const doctors = [{ id: '1', title: 'استشاري رمد', ... }];
   const result = filterDoctorsByTitle(doctors, 'رمد');
   // Expected: [doctors[0]]
   ```

2. **Unicode Match**
   ```typescript
   const result = filterDoctorsByTitle(doctors, '\u0631\u0645\u062f');
   // Expected: [doctors[0]] (same as above)
   ```

3. **No Match**
   ```typescript
   const result = filterDoctorsByTitle(doctors, 'غير موجود');
   // Expected: [] (empty array, console message logged)
   ```

4. **Case Insensitive**
   ```typescript
   const result = filterDoctorsByTitle(doctors, 'رمد');
   // Should match titles with "رمد", "رمد", etc.
   ```

## Console Output

When no matches are found, the function logs:
```
Dorak: لم يتم العثور على أطباء باللقب "{searchTitle}". جرب البحث بكلمات مختلفة.
```

## Performance Considerations

- Uses ES6+ `filter()` for optimal performance
- Normalization is done once per doctor title
- No nested loops
- Efficient Set-based deduplication when combining filters

## Future Enhancements

1. Add fuzzy matching for typos
2. Support partial word matching
3. Add relevance scoring
4. Cache normalized strings for repeated searches
5. Add support for multiple search terms

## Related Files

- `website/types.ts` - Doctor interface definition
- `website/constants.tsx` - Specialty labels
- `website/utils/dataTransform.ts` - Data transformation utilities
- `website/App.tsx` - Main app component with doctor state
