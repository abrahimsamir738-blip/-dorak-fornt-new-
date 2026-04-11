<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'title' => $this->title,
            'specialty' => $this->specialty,
            'image_url' => $this->image_url,
            'rating' => $this->rating,
            'reviews_count' => $this->reviews_count,
            'location' => $this->location,
            'is_online' => (bool) $this->is_online,
            
            // Dynamic Logic: Calculation for the "Next Role" badge
            // Fetching current waiting count + 1 to determine the potential patient rank
            'next_turn' => $this->reservations()->where('status', 'waiting')->count() + 1,
            
            // Core Financial Data
            'consultation_fee' => $this->consultation_fee,
            'service_fee' => 15, // Standard platform service fee
            
            'experience' => $this->experience,
            'education' => $this->education,
            
            // Relationships
            'branches' => BranchResource::collection($this->whenLoaded('branches')),
        ];
    }
}
