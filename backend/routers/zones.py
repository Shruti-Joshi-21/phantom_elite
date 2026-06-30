import os
import json
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/zones", tags=["Zones"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZONES_FILE = os.path.join(BASE_DIR, "mock_data", "zones.json")

def load_zones():
    if not os.path.exists(ZONES_FILE):
        return []
    with open(ZONES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("")
def get_all_zones():
    """
    Returns the list of all master wards/zones with their geo coordinates, LST temperatures,
    vulnerability scores, and details.
    """
    return load_zones()

@router.get("/{zone_id}/diagnose")
def diagnose_zone(zone_id: str):
    """
    Returns mock SHAP-style driver attributions for the given zone ID
    to diagnose primary contributors to heat severity.
    """
    zones = load_zones()
    zone = next((z for z in zones if z["id"] == zone_id), None)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    # Format drivers as key-value metric weight structure
    return {
        "zone_id": zone_id,
        "zone_name": zone["name"],
        "tempC": zone["tempC"],
        "heatLevel": zone["heatLevel"],
        "drivers": zone.get("drivers", [])
    }
