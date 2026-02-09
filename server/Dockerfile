# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["server.csproj", "./"]
# Creating a solution file for restore if needed, or just restore project
RUN dotnet restore "server.csproj"

# Copy everything else and build
COPY . .
RUN dotnet publish "server.csproj" -c Release -o /app/publish

# Runtime stage
# Note: Using aspnet runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "server.dll"]
