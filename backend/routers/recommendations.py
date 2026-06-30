import os
import json
from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INTERVENTIONS_FILE = os.path.join(BASE_DIR, "mock_data", "interventions.json")

def load_interventions():
    if not os.path.exists(INTERVENTIONS_FILE):
        return []
    with open(INTERVENTIONS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("")
def get_recommendations(budget: float = Query(2000000.0, description="Available budget cap in Rupees")):
    """
    Returns a list of recommended interventions filtered and ranked greedily
    based on cost-efficiency (temperature reduction per Rupee spent).
    """
    interventions = load_interventions()
    
    # Sort by efficiency: tempReduction drop per rupee spent (highest absolute drop/cost first)
    # since tempReduction is negative, abs(tempReduction)/cost works perfectly
    sorted_interventions = sorted(
        interventions,
        key=lambda x: abs(x["tempReduction"]) / x["cost"],
        reverse=True
    )
    
    remaining_budget = budget
    selected = []
    unselected = []
    
    for item in sorted_interventions:
        if item["cost"] <= remaining_budget:
            selected.append(item)
            remaining_budget -= item["cost"]
        else:
            unselected.append(item)
            
    total_cost_spent = sum(item["cost"] for item in selected)
    total_temp_reduction = abs(sum(item["tempReduction"] for item in selected))
    
    return {
        "selected": selected,
        "unselected": unselected,
        "totalCostSpent": total_cost_spent,
        "totalTempReduction": round(total_temp_reduction, 2),
        "remainingBudget": remaining_budget
    }
