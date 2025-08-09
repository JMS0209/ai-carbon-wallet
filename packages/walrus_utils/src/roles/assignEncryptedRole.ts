import { new } from '@mysten/walrus';
import { ROLES, Role } from '../../../../packages/shared_utils/src/constants/roles';

export async function assignEncryptedRole(userAddress: string, role: Role) {
  const rolePayload = {
    role,
    assignedAt: Date.now(),
    assignedBy: '0xYourAdminAddress',
  };

  const encrypted = await encodeQuilt(userAddress, rolePayload);
  return encrypted;
}