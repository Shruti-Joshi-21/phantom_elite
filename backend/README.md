# UrbanCool FastAPI Backend Stub

This is a minimal FastAPI structural stub demonstrating the back-end architecture for the UrbanCool decision-support engine.

## Prerequisites

- Python 3.8+ installed on your system.

## Setup Instructions

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   # On Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server via Uvicorn**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

## Endpoint Documentation

Once the server is running, you can open:
- **Health Check**: `http://localhost:8000/`
- **Interactive Swagger Docs UI**: `http://localhost:8000/docs`

### Exposed Routes:
- `GET /api/zones`: Retrieve all zone geographic coordinates and current temperatures.
- `GET /api/zones/{zone_id}/diagnose`: Auto-diagnose and view SHAP-style driver attributions for a specific zone.
- `GET /api/recommendations?budget={amount}`: Greedily rank interventions by cost-efficiency under a budget limit.
- `POST /api/budget/allocate`: Allocate a budget across multiple zone IDs proportionally based on vulnerability.
