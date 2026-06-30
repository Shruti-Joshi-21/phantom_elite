import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List

router = APIRouter(prefix="/api/budget", tags=["Budget Allocation"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZONES_FILE = os.path.join(BASE_DIR, "mock_data", "zones.json")

def load_zones():
    if not os.path.exists(ZONES_FILE):
        return []
    with open(ZONES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

class AllocationRequest(BaseModel):
    budget: float = Field(..., gt=0, description="Total budget to distribute across selected zones in Rupees")
    zone_ids: List[str] = Field(..., min_items=1, description="List of zone IDs to fund")

@router.post("/allocate")
def allocate_budget(request: AllocationRequest):
    """
    Accepts total budget and selected zone IDs, and outputs a mock optimization allocation
    distributing funding proportionally based on vulnerability indexes.
    """
    all_zones = load_zones()
    selected_zones = [z for z in all_zones if z["id"] in request.zone_ids]
    
    if not selected_zones:
        raise HTTPException(
            status_code=400,
            detail="None of the provided zone IDs match existing records."
        )
        
    total_vuln = sum(z["vulnerabilityScore"] for z in selected_zones)
    if total_vuln == 0:
        total_vuln = len(selected_zones)  # Avoid division by zero
        
    allocations = []
    total_reduction = 0.0
    
    for z in selected_zones:
        # Proportional budget split based on vulnerability score
        share = z["vulnerabilityScore"] / total_vuln
        allocated_amount = round(request.budget * share, 2)
        
        # Estimate temp reduction: ~-1.5°C per 10 Lakhs spent, scaled by vulnerability factor
        est_reduction = round(-1.5 * (allocated_amount / 1000000.0) * (z["vulnerabilityScore"] / 80.0), 2)
        
        # Clamp temp reduction to a reasonable bounds (e.g. max -3.0C cooling)
        if est_reduction < -3.0:
            est_reduction = -3.0
            
        total_reduction += est_reduction
        
        allocations.append({
            "zoneId": z["id"],
            "zoneName": z["name"],
            "allocatedAmount": allocated_amount,
            "projectedReductionC": est_reduction
        })
        
    return {
        "totalSpent": request.budget,
        "overallProjectedReductionC": round(total_reduction, 2),
        "allocations": allocations
    }
