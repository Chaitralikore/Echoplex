# Echoplex Backend - Enterprise Architecture

Production-ready backend service for Echoplex Event Safety Platform with modular architecture, comprehensive error handling, and real-time WebSocket support.

## Architecture Overview

```
echoplex-backend/
├── src/
│   ├── config/           # Configuration (Supabase, database)
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware (validation, error handling, rate limiting)
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic (Supabase queries, real-time service)
│   └── utils/           # Utilities (logger, constants)
├── logs/                # Application logs
├── server.js            # Main entry point
├── package.json         # Dependencies
└── .env                 # Environment variables
```

## Key Features

✅ **Modular Architecture** - Separation of concerns with controllers, services, middleware
✅ **Enterprise Security** - Helmet.js, rate limiting, CORS, input validation
✅ **Comprehensive Logging** - Winston logger with file/console transports
✅ **Real-time WebSocket** - Socket.IO for instant zone updates
✅ **Error Handling** - Centralized error handler with proper HTTP status codes
✅ **Request Validation** - Joi schema validation for all endpoints
✅ **Rate Limiting** - Protect API from abuse
✅ **Supabase Integration** - Direct database access

## Installation

```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your Supabase credentials
```

## Configuration

Update `.env` with:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

## Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### Zones
- `GET /api/zones` - Get all zones with occupancy
- `GET /api/zones/:zoneId` - Get specific zone details
- `POST /api/zone-event` - Process check-in/check-out
- `GET /api/zone-events` - Get event history

### Analytics
- `GET /api/analytics` - Get all zones analytics
- `GET /api/analytics/:zoneId` - Get specific zone analytics

### Health
- `GET /health` - Server health check

## Usage Examples

### Get All Zones
```bash
curl http://localhost:3000/api/zones
```

### Check In to Zone
```bash
curl -X POST http://localhost:3000/api/zone-event \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "zone_id": "550e8400-e29b-41d4-a716-446655440000",
    "action": "check-in"
  }'
```

### Get Zone Events
```bash
curl "http://localhost:3000/api/zone-events?zone_id=550e8400-e29b-41d4-a716-446655440000&limit=10"
```

## WebSocket Events

### Client Connection
```javascript
const socket = io('http://localhost:3000');

socket.on('initial-data', (data) => {
  console.log('Zones:', data.zones);
});

socket.on('zone-update', (zone) => {
  console.log('Zone updated:', zone);
});
```

## Project Structure Details

### Controllers (`src/controllers/`)
- Handle HTTP requests
- Delegate to services
- Return formatted responses

### Services (`src/services/`)
- Implement business logic
- Query Supabase database
- Handle data transformations

### Middleware (`src/middleware/`)
- `validateRequest.js` - Joi schema validation
- `errorHandler.js` - Centralized error handling
- `rateLimiter.js` - Rate limiting protection

### Routes (`src/routes/`)
- Define API endpoints
- Apply middleware
- Map to controllers

### Config (`src/config/`)
- Supabase client initialization
- Connection testing

### Utils (`src/utils/`)
- Winston logger setup
- Constants (risk levels, error messages, etc.)

## Error Handling

All errors return consistent JSON format:
```json
{
  "success": false,
  "error": "Error message",
  "details": [/* validation details if applicable */]
}
```

## Logging

Logs stored in `logs/`:
- `error.log` - Errors only
- `combined.log` - All logs

Console output includes timestamp and level:
```
2024-01-10 10:30:45 info: ✅ Supabase connection successful
2024-01-10 10:30:46 http: GET /api/zones 200
```

## Rate Limiting

- Default: 100 requests per 15 minutes
- Configurable via `RATE_LIMIT_*` env vars
- Returns 429 Too Many Requests when exceeded

## Deployment

### Heroku
```bash
git push heroku main
```

### Railway
Connect GitHub repo and deploy

### AWS/GCP/Azure
- Set environment variables
- Run `npm install && npm start`
- Use process manager (PM2)

## Monitoring

- Health check: `GET /health`
- Logs: Check `logs/` directory
- WebSocket connections: Logged in console

## Security Checklist

✅ Helmet.js enabled
✅ CORS configured
✅ Rate limiting active
✅ Input validation with Joi
✅ Error messages don't leak sensitive info
✅ Environment variables for secrets
✅ Proper HTTP status codes

## Google ADK Integration

The Google ADK Python framework could be integrated as a separate microservice for:
- Advanced anomaly detection using AI agents
- Predictive crowd behavior analysis
- Multi-agent event coordination

Current setup is ready for integration via REST APIs between Node.js and Python services.

## Troubleshooting

### "Cannot find module" errors
- Run `npm install`
- Check Node.js version (use 18+)

### "Missing Supabase credentials"
- Verify `.env` file exists
- Check `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Restart server after updating `.env`

### "Port already in use"
- Change `PORT` in `.env`
- Or kill process: `lsof -ti:3000 | xargs kill -9`

### WebSocket not connecting
- Check CORS origin in `.env`
- Verify `FRONTEND_URL` matches client URL
- Check browser console for errors

## Support

- Check logs in `logs/` directory
- Verify database connection: `GET /health`
- Test endpoints with curl/Postman
- Review error messages in response

## License

MIT
