# Real-time Chat Application

A modern real-time chat application built with Next.js, ASP.NET Core, and SignalR.

## Technology Stack

### Frontend (`/client`)
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Real-time Client**: `@microsoft/signalr`
- **Icons**: Lucide React

### Backend (`/server`)
- **Framework**: ASP.NET Core
- **Language**: C#
- **Real-time Server**: SignalR
- **Architecture**: Web API with Controllers and Hubs

### Database & Infrastructure
- **Database**: MongoDB
- **Containerization**: Docker & Docker Compose
- **Admin UI**: Mongo Express

## Project Structure

```
├── client/          # Next.js frontend application
├── server/          # ASP.NET Core backend API & SignalR hub
└── docker-compose.yml # Docker orchestration configuration
```

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

### Application Setup

1. Clone the repository (if applicable) or navigate to the project root.

2. Start the application using Docker Compose:

   ```bash
   docker-compose up --build
   ```

   This command will build the client and server images and start the following services:
   - **Client**: Accessible at [http://localhost:3000](http://localhost:3000)
   - **Server API**: Accessible at [http://localhost:5000](http://localhost:5000)
   - **MongoDB**: Running on port 27017
   - **Mongo Express**: Database admin UI at [http://localhost:8081](http://localhost:8081)

## Development

If you prefer to run services locally without Docker:

### Server

1. Navigate to the `server` directory.
2. Ensure you have a local MongoDB instance running or update `appsettings.Development.json`.
3. Run the .NET application:

   ```bash
   dotnet run
   ```

### Client

1. Navigate to the `client` directory.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```
