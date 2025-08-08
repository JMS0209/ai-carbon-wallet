import { getSuiClient } from '../utils/suiClient';

export async function viewLog() {
  const suiClient = getSuiClient();

  const events = await suiClient.queryEvents({
    query: {
      MoveEvent: {
        package: '0xYourPackageId',
        module: 'RoleAccess',
        // Optional: type: 'RoleAssigned' or 'RoleRevoked'
      },
    },
    limit: 10,
  });

  console.log('📜 Recent Role Events:');
  for (const event of events.data) {
    const { sender, type, timestampMs } = event;
    const readableTime = new Date(Number(timestampMs)).toLocaleString();
    console.log(`- ${sender} triggered ${type} at ${readableTime}`);
  }
}
