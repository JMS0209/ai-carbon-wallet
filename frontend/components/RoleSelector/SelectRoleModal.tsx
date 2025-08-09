import React from 'react';
import { ROLES, Role } from '../../../packages/shared_utils/src/constants/roles';

type Props = {
  onSelect: (role: Role) => void;
};

export const SelectRoleModal: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Select Your Role</h2>
        <ul className="space-y-3">
          {Object.values(ROLES).map((role) => (
            <li key={role}>
              <button
                onClick={() => onSelect(role)}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {role.replace('-', ' ').toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};