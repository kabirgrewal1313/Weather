import redis

r = redis.Redis(
    host='localhost',
    port=6379,
    db=0
)

def get_cached_weather(city):
    weather = r.get(city)
    if weather:
        return weather.decode('utf-8')
    return None

def cache_weather(city, data):
    r.setex(city, 300, data)

CACHE_TTL = 600  # 10 minutes
