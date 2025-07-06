from fastapi import FastAPI,Depends,HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from auth import create_access_token, verify_token
from models import fake_users,hash_password,verify_password
from weather import fetch_full_weather
from contextlib import asynccontextmanager
from fastapi.responses import StreamingResponse
import io
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
async def lifespan(app: FastAPI):
    print("✅ Weather API running at http://127.0.0.1:8000 🚀")
    yield  # Application runs during this time
    print("🛑 Shutting down Weather API...")

app=FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Your frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register")
def register(form_data: OAuth2PasswordRequestForm=Depends()):
    if form_data.username in fake_users:
        raise HTTPException(status_code=400, detail="User exists")
    fake_users[form_data.username]=hash_password(form_data.password)
    return {"msg":"User registered"}
@app.post("/login")
def login(form_data:OAuth2PasswordRequestForm=Depends()):
    user=fake_users.get(form_data.username)
    if not user or not verify_password(form_data.password,user):
        raise HTTPException(status_code=401,detail="Invalid Credentials")
    token=create_access_token({"sub":form_data.username})
    return {"access_token":token,"token_type":"bearer"}
@app.get("/weather")
def weather(city:str,username:str=Depends(verify_token)):
    return fetch_full_weather(city)

@app.get("/weather/plot")
def weather_plot(city: str, username: str = Depends(verify_token)):
    data = fetch_full_weather(city)
    
    # Group temperatures per day
    daily_avg = {}
    for item in data["forecast"]:
        date = item["datetime"].split(" ")[0]
        temp = item["temp"]
        daily_avg.setdefault(date, []).append(temp)
    
    dates = []
    avg_temps = []
    for date, temps in daily_avg.items():
        dates.append(date)
        avg_temps.append(sum(temps) / len(temps))

    # Plot
    fig, ax = plt.subplots()
    ax.plot(dates, avg_temps, marker='o', color='orange')
    ax.set_xlabel("Date")
    ax.set_ylabel("Avg Temp (°C)")
    ax.set_title(f"Average Daily Temperature for {data['city']}")
    plt.xticks(rotation=45)

    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close()

    return StreamingResponse(buf, media_type="image/png")

