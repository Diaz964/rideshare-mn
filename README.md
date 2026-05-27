# RideShare MN

A full-featured ride-sharing application for Minnesota, built with Next.js 16, TypeScript, Prisma, and Tailwind CSS.

## Features

### For Passengers
- **Account Management**: Register, login, and manage your profile
- **Book Rides**: Set pickup/dropoff locations on an interactive map
- **Fare Estimates**: Get transparent fare breakdowns before booking
- **Real-time Tracking**: Track your driver's location during the ride
- **Ride History**: View all past rides with details
- **Ratings**: Rate your driver after each ride

### For Drivers
- **Driver Onboarding**: Register with license and vehicle information
- **Dashboard**: Go online/offline, view and accept available rides
- **Ride Management**: Accept, navigate to, start, and complete rides
- **Earnings Tracker**: View daily, weekly, and total earnings
- **Rating System**: Maintain your driver rating

### Core Systems
- **Fare Calculation**: Distance + time + base fare + booking fee with surge pricing
- **Real-time Matching**: Passengers matched with nearby available drivers
- **Secure Authentication**: JWT-based session management with bcrypt password hashing
- **Minnesota Coverage**: Centered on Twin Cities metro area (Minneapolis/St. Paul)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom JWT with jose + bcrypt
- **Maps**: Leaflet with OpenStreetMap
- **State Management**: Zustand
- **Payments**: Stripe (integration ready)
- **Validation**: Zod

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- npm

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and other credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret key for JWT signing |
| `NEXTAUTH_URL` | Application URL |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key (optional, uses OpenStreetMap by default) |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, register)
│   ├── passenger/         # Passenger pages (book ride, history, profile)
│   ├── driver/            # Driver pages (dashboard, rides, earnings, profile)
│   ├── admin/             # Admin dashboard
│   └── api/               # API route handlers
├── components/            # React components
│   ├── ui/               # Base UI components (Button, Input, Card)
│   ├── maps/             # Map components
│   ├── shared/           # Shared components (Navbar, AuthProvider)
│   ├── passenger/        # Passenger-specific components
│   └── driver/           # Driver-specific components
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication logic
│   ├── db.ts             # Database client
│   ├── fare.ts           # Fare calculation
│   └── validations.ts    # Zod schemas
├── store/                 # Zustand state stores
├── types/                 # TypeScript type definitions
└── generated/             # Generated Prisma client
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register passenger
- `POST /api/auth/register/driver` - Register driver
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current session

### Rides
- `POST /api/rides` - Request a ride
- `GET /api/rides` - Get ride history
- `GET /api/rides/[id]` - Get ride details
- `PATCH /api/rides/[id]` - Update ride status (accept, start, complete, cancel)
- `GET /api/rides/available` - Get available rides (drivers)
- `POST /api/rides/estimate` - Get fare estimate

### Drivers
- `GET /api/drivers` - Get driver profile
- `PATCH /api/drivers` - Update driver status/location
- `GET /api/drivers/earnings` - Get earnings data

### Ratings
- `POST /api/ratings` - Submit a rating

## Fare Structure

| Component | Rate |
|-----------|------|
| Base Fare | $2.50 |
| Per Mile | $1.75 |
| Per Minute | $0.35 |
| Booking Fee | $1.50 |
| Minimum Fare | $5.00 |
| Driver Earnings | 75% of fare |

## License

MIT
