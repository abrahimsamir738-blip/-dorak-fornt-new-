
<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DoctorController extends Controller
{
    /**
     * Display a listing of doctors, filtered by specialty if provided.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // Start building the query
        $query = Doctor::query();

        // Automated Specialty Filtering
        // Example: /api/doctors?specialty=Orthopedics
        if ($request->has('specialty') && !empty($request->specialty)) {
            $query->where('specialty', $request->specialty);
        }

        // Search logic (optional extension)
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('title', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Fetch results with related branches
        $doctors = $query->with('branches')->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $doctors,
            'count' => $doctors->count()
        ]);
    }
}
