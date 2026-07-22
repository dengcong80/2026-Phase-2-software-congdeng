import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export function createLeaderboardConnection(token: string): HubConnection {
  return new HubConnectionBuilder()
    .withUrl('http://localhost:5000/hubs/leaderboard', {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();
}
