# Booking Modal Debug Implementation

## Overview
Comprehensive debugging has been added to the `BookingModal` component to help identify why time slots are not rendering. The implementation includes multiple layers of logging and a test mode to force display all slots.

## Debug Features Implemented

### 1. ✅ Clinic Data Logging
**Location**: `fetchSchedulesForBranch` function

**What it logs**:
- Fetches full doctor data to check clinic structure
- Logs clinic data with `timeSlots` and `time_slots` properties
- Shows count and days for both naming conventions

**Console Output**:
```
🏥 Fetched Clinic Data: {id: 1, name: "...", timeSlots: [...], time_slots: [...]}
🏥 Clinic has timeSlots? true/false
🏥 Clinic has time_slots? true/false
🏥 timeSlots count: X
🏥 timeSlots days: ['السبت', 'الأحد', ...]
```

### 2. ✅ Raw API Response Logging
**Location**: `fetchSchedulesForBranch` function

**What it logs**:
- Raw API response **BEFORE** `.map()` transformation
- Branch ID being fetched
- Schedules count and type
- Handles nested data structures (checks for `data`, `slots`, `time_slots`, `timeSlots`)

**Console Output**:
```
🔍 Raw API Response (schedules) BEFORE .map(): [...]
🔍 Branch ID: 1
🔍 Schedules count: X
🔍 Schedules type: array/object
⚠️ Schedules is not an array, checking for nested data...
🔍 Extracted schedules array: [...]
```

### 3. ✅ Day Comparison Logging
**Location**: `filteredSlots` useMemo

**What it logs**:
- Selected day (both ID and name)
- Available days in data
- Day matching details for each slot
- Filter results

**Console Output**:
```
🔍 Filtering slots - selectedDay: 2, selectedDayName: 'الاثنين'
🔍 Available slots count: X
🔍 Available days: [{id: 0, name: 'السبت'}, ...]
📅 Selected Day: 2 الاثنين
📅 Available Days in Data: [{day_of_week: 0, day_name: 'السبت', ...}, ...]
```

### 4. ✅ Slot Filtering Logs
**Location**: `filteredSlots` useMemo filter function

**What it logs**:
- Each slot's day_name and day_of_week
- Filter criteria (dayNameToFilter, dayToFilter)
- Match results (matchesDay, inWorkingHours)
- Reasons for filtering out slots

**Console Output**:
```
📅 Slot filtered out (day mismatch): {
  slotDayName: 'السبت',
  slotDayOfWeek: 0,
  filterDayName: 'الاثنين',
  filterDayOfWeek: 2
}
⏰ Slot filtered out (not in working hours 5 PM - 9 PM): {...}
🎯 Filtered Slots for day الاثنين (day_of_week: 2): [...]
🎯 Total filtered slots: X
```

### 5. ✅ Force Display Mode (Test Mode)
**Location**: `filteredSlots` useMemo

**Feature**: If `selectedDay` is `null`, shows **ALL** slots regardless of day filter

**Purpose**: 
- Confirms slots can render on screen
- Helps identify if issue is with filtering or data fetching
- Visual indicator shows "🧪 TEST MODE" banner

**UI Indicator**:
```tsx
{selectedDay === null && (
  <div className="mb-4 p-2 bg-amber-100 ...">
    <p>🧪 TEST MODE: Showing ALL slots (selectedDay is null)</p>
  </div>
)}
```

### 6. ✅ Rendering Logs
**Location**: Slot rendering in JSX

**What it logs**:
- Each slot being rendered with its ID, day_name, and start_time

**Console Output**:
```
🎨 Rendering slot: 1 الاثنين 17:00
🎨 Rendering slot: 2 الاثنين 17:30
```

### 7. ✅ Debug Info in UI
**Location**: Empty slots message

**What it shows**:
- `availableSlots` count
- `selectedDay` value
- Helps identify if data exists but isn't filtering correctly

**UI Display**:
```
Debug: availableSlots=5, selectedDay=null
```

## Infinite Loop Prevention

### Log Key Tracking
Uses `lastLogKey` ref to prevent infinite logging in `useMemo`:

```typescript
const lastLogKey = useRef('');

// In useMemo:
const logKey = `${selectedDay}-${selectedDayName}-${availableSlots.length}`;
if (lastLogKey.current !== logKey) {
  console.log(...);
  lastLogKey.current = logKey;
}
```

### Callback Dependencies
- `fetchSchedulesForBranch` depends only on `doctor.id` to prevent infinite loops
- `filteredSlots` useMemo has proper dependencies: `[availableSlots, selectedDay, selectedDayName, availableDays]`

## Data Structure Checks

### Relationship Naming
The code checks for both naming conventions:
- `timeSlots` (camelCase) - Laravel default
- `time_slots` (snake_case) - JSON serialization

### Array Validation
```typescript
// Ensure we have an array
if (!Array.isArray(schedulesArray)) {
  console.error('❌ Schedules is not an array after extraction:', schedulesArray);
  schedulesArray = [];
}
```

## Debugging Workflow

### Step 1: Check API Response
1. Open browser console
2. Open booking modal
3. Look for: `🔍 Raw API Response (schedules) BEFORE .map()`
4. Verify it's an array with slot data

### Step 2: Check Clinic Data
1. Look for: `🏥 Fetched Clinic Data`
2. Check if `timeSlots` or `time_slots` exists
3. Verify day names match expected format

### Step 3: Check Filtering
1. Look for: `🔍 Filtering slots`
2. Check `selectedDay` and `selectedDayName` values
3. Verify day matching logic

### Step 4: Test Mode
1. If slots don't appear, check if `selectedDay` is `null`
2. If `null`, slots should show in TEST MODE
3. If TEST MODE shows slots, issue is with day filtering
4. If TEST MODE shows nothing, issue is with data fetching

### Step 5: Check Rendering
1. Look for: `🎨 Rendering slot`
2. If this appears, slots are rendering but may be hidden
3. Check CSS/styling issues

## Expected Console Output Flow

```
🏥 Fetched Clinic Data: {...}
🏥 Clinic has timeSlots? true
🏥 timeSlots count: 10
🏥 timeSlots days: ['السبت', 'الأحد', 'الاثنين', ...]

🔍 Raw API Response (schedules) BEFORE .map(): [...]
🔍 Branch ID: 1
🔍 Schedules count: 10
🔍 Schedules type: array

🔍 Raw Slot: {id: 1, day_of_week: 0, day_name: 'السبت', ...}
✅ Transformed Slots: [...]
✅ Total slots after filtering: 8

📅 Auto-selecting first day: 0 السبت
📆 Available Days: ['السبت', 'الأحد', ...]

🔍 Filtering slots - selectedDay: 0, selectedDayName: 'السبت'
🔍 Available slots count: 8
📅 Selected Day: 0 السبت
📅 Available Days in Data: [...]

🎯 Filtered Slots for day السبت (day_of_week: 0): [...]
🎯 Total filtered slots: 3

🎨 Rendering slot: 1 السبت 17:00
🎨 Rendering slot: 2 السبت 17:30
🎨 Rendering slot: 3 السبت 18:00
```

## Troubleshooting Guide

### Issue: No slots appear
**Check**:
1. `🔍 Schedules count: 0` → API not returning data
2. `✅ Total slots after filtering: 0` → All slots filtered out (time range)
3. `🎯 Total filtered slots: 0` → Day filter not matching
4. No `🎨 Rendering slot` → Slots not reaching render

### Issue: Slots appear in TEST MODE but not when day selected
**Check**:
1. Day name mismatch: `slotDayName` vs `filterDayName`
2. Day of week mismatch: `slotDayOfWeek` vs `filterDayOfWeek`
3. Working hours filter: Check if times are 5 PM - 9 PM

### Issue: Infinite console logs
**Check**:
1. `lastLogKey` ref is working
2. `useMemo` dependencies are correct
3. `useCallback` dependencies are minimal

## Files Modified

1. **website/components/BookingModal.tsx**
   - Added comprehensive logging throughout
   - Added force display mode (TEST MODE)
   - Added clinic data fetching
   - Added array validation
   - Added infinite loop prevention
   - Added debug UI indicators

## Next Steps

1. Open booking modal in browser
2. Open browser console (F12)
3. Review all console logs
4. Identify where data flow breaks
5. Use TEST MODE to confirm slots can render
6. Check day name matching (Arabic vs English)
7. Verify time range filtering (5 PM - 9 PM)
