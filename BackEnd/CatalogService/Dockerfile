FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy the entire backend so cross-project references (e.g. Contracts) are available
COPY . .
WORKDIR /src/CatalogService

RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 5085 5086
ENTRYPOINT ["dotnet", "CatalogService.dll"]
