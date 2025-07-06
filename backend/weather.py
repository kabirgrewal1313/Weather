import requests
from fastapi import HTTPException
import json
from dotenv import load_dotenv
import os
from cache import r, CACHE_TTL
load_dotenv()
API_KEY =os.getenv("WEATHER_API_KEY")  # Replace with your actual OpenWeather API key

def fetch_full_weather(city: str):
    cached_data = r.get(city)

    if cached_data:
        return json.loads(cached_data)

    # 1. Fetch Current Weather
    curr_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    curr_res = requests.get(curr_url)
    print(curr_res)
    if curr_res.status_code != 200:
        raise HTTPException(status_code=404, detail="City not found")

    curr_data = curr_res.json()

    # 2. Fetch 5-Day Forecast (3-hour intervals)
    forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
    forecast_res = requests.get(forecast_url)

    if forecast_res.status_code != 200:
        raise HTTPException(status_code=404, detail="City forecast not found")

    forecast_data = forecast_res.json()

    # 3. Structure Data
    response = {
        "city": curr_data["name"],
        "country": curr_data["sys"]["country"],
        "coordinates": {
            "lat": curr_data["coord"]["lat"],
            "lon": curr_data["coord"]["lon"]
        },
        "current_weather": {
            "temperature": curr_data["main"]["temp"],
            "description": curr_data["weather"][0]["description"].title(),
            "humidity": curr_data["main"]["humidity"],
            "wind_speed": curr_data["wind"]["speed"]
        },
        "forecast": []
    }

    for item in forecast_data["list"]:
        response["forecast"].append({
            "datetime": item["dt_txt"],
            "temp": item["main"]["temp"],
            "description": item["weather"][0]["description"].title()
        })

    r.setex(city, CACHE_TTL, json.dumps(response))

    return response
