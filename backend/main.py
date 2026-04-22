from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import gspread
from google.oauth2.service_account import Credentials

app = FastAPI()

# ✅ CORS (Frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔑 Google Sheets Setup
scopes = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

try:
    creds = Credentials.from_service_account_file("/etc/secrets/credentials.json", scopes=scopes)
    client = gspread.authorize(creds)

    # 🔥 Use SHEET ID
    SPREADSHEET_ID = "1TAZjCR5tiA2HzwzT_dNTvwssVkTCCyf2ifCTg7znw_c"

    spreadsheet = client.open_by_key(SPREADSHEET_ID)

    # 📂 Access Tabs
    courses_sheet = spreadsheet.worksheet("Courses")
    schedule_sheet = spreadsheet.worksheet("Schedule")
    contacts_sheet = spreadsheet.worksheet("Contacts")

except Exception as e:
    print("❌ Google Sheets Connection Error:", e)


# ✅ Root API (for testing)
@app.get("/")
def home():
    return {"msg": "Backend Running Successfully 🚀"}


# 📚 Courses API
@app.get("/courses")
def get_courses():
    try:
        return courses_sheet.get_all_records()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 📅 Schedule API
@app.get("/schedule")
def get_schedule():
    try:
        return schedule_sheet.get_all_records()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 📩 Contact Model
class Contact(BaseModel):
    name: str
    email: str
    message: str


# 📩 Contact API
@app.post("/contact")
def contact(data: Contact):
    try:
        contacts_sheet.append_row([
            data.name,
            data.email,
            data.message
        ])
        return {"msg": "Saved successfully ✅"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))