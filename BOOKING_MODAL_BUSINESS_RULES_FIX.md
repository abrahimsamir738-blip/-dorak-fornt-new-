# Booking Modal Business Rules Implementation

## Issues Fixed

### 1. ✅ Time Slots Visibility - Filter by Day String
**Problem**: Slots not appearing for selected days. Need to filter by day_name (string) like 'الاثنين' (Monday).

**Solution**:
- Added `selectedDayName` state to track selected day by name (string)
- Updated filtering logic to primarily use `day_name` (string) for matching
- Added fallback to `day_of_week` (integer) for safety
- Enhanced debug logging to show day matching details

**Code Changes**:
```typescript
// Added state for day name
const [selectedDayName, setSelectedDayName] = useState<string | null>(null);

// Filter by day_name (string) - e.g., 'الاثنين' (Monday)
const filtered = availableSlots.filter(slot => {
  // Primary filter: day_name string
  const matchesDay = slot.day_name === dayNameToFilter || slot.day_of_week === dayToFilter;
  return matchesDay && inWorkingHours;
});
```

**Debug Logging**:
- `console.log('🔍 Raw API Response (schedules) BEFORE .map():', schedules)` - Added before .map()
- Logs each slot's day_name and day_of_week for comparison
- Logs filtered results with day name

### 2. ✅ Disable Booking for Closed Clinics
**Problem**: Need to disable booking button and show message when clinic is closed.

**Solution**:
- Added `isClosedToday` to `Branch` interface
- Updated `dataTransform` to include `is_closed_today` from backend
- Added visual indicators on clinic cards (red border, "مغلق" badge)
- Disabled clinic selection if closed
- Added warning message: "هذه العيادة مغلقة حالياً"
- Disabled submit button when clinic is closed

**Code Changes**:
```typescript
// Branch interface
export interface Branch {
  // ... other fields
  isClosedToday?: boolean; // Clinic closed status
}

// Clinic card with closed status
const isClosed = branch.isClosedToday || false;
className={`... ${isClosed ? 'border-rose-300 bg-rose-50 opacity-75 cursor-not-allowed' : '...'}`}

// Submit button disabled
disabled={!selectedSlot || !name || !phone || selectedBranch?.isClosedToday}
```

**UI Elements**:
- Red border and background for closed clinics
- "مغلق" badge in top-left corner
- "مغلق اليوم" text below clinic name
- Warning message: "⚠️ هذه العيادة مغلقة حالياً"
- Submit button text changes to "العيادة مغلقة" when disabled

### 3. ✅ Backend Validation (403 Error)
**Problem**: Need to prevent bookings via API when clinic is closed.

**Solution**:
- Added validation in `OrderController::store()` method
- Checks `$clinic->is_closed_today` before creating order
- Returns 403 Forbidden with Arabic error message

**Code Changes**:
```php
// In OrderController::store()
$clinic = $request->user()->clinics()->findOrFail($validated['clinic_id']);

// Backend validation: Check if clinic is closed
if ($clinic->is_closed_today) {
    return response()->json([
        'message' => 'العيادة مغلقة حالياً ولا يمكن الحجز',
        'error' => 'clinic_closed'
    ], 403);
}
```

**Note**: `PublicController::createBooking()` already has this check, but `OrderController` is for authenticated doctors, so we added it there too.

### 4. ✅ Removed Expected Turn Section
**Status**: Already removed in previous fix. Verified no "دورك المتوقع" section exists.

### 5. ✅ Sync UI with Dashboard
**Problem**: Clinic cards should reflect same status as dashboard (localhost:3000).

**Solution**:
- Updated `PublicController::doctors()` to include `is_closed_today` in clinic data
- Updated `dataTransform.ts` to map `is_closed_today` to `isClosedToday`
- Clinic cards now show:
  - Red styling when closed
  - "مغلق" badge
  - "مغلق اليوم" text
  - Disabled state (can't select)

**Backend Changes**:
```php
// Include is_closed_today in clinics
$doctors = Doctor::with(['clinics' => function ($query) {
  $query->select('id', 'doctor_id', 'name', 'address', 'consultation_fee', 'working_hours', 'is_closed_today', 'map_link', 'photo');
}, 'clinics.timeSlots' => ...])->get();
```

**Frontend Changes**:
```typescript
// dataTransform.ts
const branches: Branch[] = (backendDoctor.clinics || []).map((clinic: any) => ({
  // ... other fields
  isClosedToday: clinic.is_closed_today || false,
}));
```

## Data Flow

### Clinic Status Sync
1. **Dashboard** (localhost:3000) → Doctor toggles clinic closure
2. **Backend** → `is_closed_today` updated in database
3. **API** → `PublicController::doctors()` includes `is_closed_today`
4. **Frontend** → `transformDoctor()` maps to `isClosedToday`
5. **BookingModal** → Shows closed status, disables booking

### Time Slot Filtering
1. **API** → Returns slots with `day_of_week` (int) and `day_name` (string)
2. **Frontend** → Transforms and stores both
3. **Day Selection** → User clicks day button (e.g., "اثنين")
4. **Filter** → Matches by `day_name` (string) primarily
5. **Display** → Shows only slots for selected day

## Console Debug Output

When modal opens, you'll see:
```
🔍 Raw API Response (schedules) BEFORE .map(): [...]
🔍 Branch ID: 1
🔍 Schedules count: X
🔍 Raw Slot: {id: 1, day_of_week: 2, day_name: 'الاثنين', ...}
✅ Transformed Slots: [...]
✅ Total slots after filtering: X
📅 Auto-selecting first day: 2 الاثنين
📆 Available Days: ['السبت', 'الأحد', 'الاثنين', ...]
🎯 Filtered Slots for day الاثنين (day_of_week: 2): [...]
🎯 Total filtered slots: X
```

## Testing Checklist

- [x] Time slots filter by day_name (string) correctly
- [x] Console.log shows API response before .map()
- [x] Closed clinics show red styling and "مغلق" badge
- [x] Closed clinics can't be selected
- [x] Submit button disabled when clinic is closed
- [x] Warning message shows: "هذه العيادة مغلقة حالياً"
- [x] Backend returns 403 when trying to book closed clinic
- [x] Clinic status syncs with dashboard
- [x] Expected Turn section removed
- [x] Slots show for first available day by default

## Files Modified

1. **website/types.ts**
   - Added `isClosedToday?: boolean` to `Branch` interface

2. **website/utils/dataTransform.ts**
   - Added `isClosedToday: clinic.is_closed_today || false` to branch transformation

3. **website/components/BookingModal.tsx**
   - Added `selectedDayName` state for string-based filtering
   - Added closed clinic UI indicators
   - Added warning message for closed clinics
   - Disabled submit button when clinic closed
   - Enhanced debug logging
   - Updated filtering to use day_name (string)

4. **backend/app/Http/Controllers/Api/OrderController.php**
   - Added 403 validation for closed clinics

5. **backend/app/Http/Controllers/Api/PublicController.php**
   - Updated `doctors()` to include `is_closed_today` in clinic data

## Business Rules Summary

### Rule 1: Time Slot Filtering
- **Filter by**: `day_name` (string) - e.g., 'الاثنين'
- **Fallback**: `day_of_week` (integer) if day_name doesn't match
- **Display**: Show slots for selected day only

### Rule 2: Closed Clinic Handling
- **Visual**: Red border, "مغلق" badge, "مغلق اليوم" text
- **Interaction**: Cannot select closed clinic
- **Booking**: Submit button disabled
- **Message**: "⚠️ هذه العيادة مغلقة حالياً"

### Rule 3: Backend Protection
- **Validation**: Check `is_closed_today` before creating order
- **Response**: 403 Forbidden with Arabic message
- **Error Code**: `'clinic_closed'`

### Rule 4: UI Sync
- **Source**: Dashboard (localhost:3000)
- **Target**: BookingModal (website)
- **Status**: `is_closed_today` synced via API

## Result

The booking modal now:
- ✅ Filters slots by day_name (string) correctly
- ✅ Shows debug logs before .map()
- ✅ Disables booking for closed clinics
- ✅ Shows clear warning messages
- ✅ Validates at backend level (403 error)
- ✅ Syncs clinic status with dashboard
- ✅ Provides professional UX
