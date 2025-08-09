"use client";

import { Address } from "viem";

interface AddressInfoDropdownProps {
  address: Address;
  displayName?: string;
  ensAvatar?: string;
  blockExplorerAddressLink?: string;
}

export const AddressInfoDropdown = ({ address, displayName, ensAvatar, blockExplorerAddressLink }: AddressInfoDropdownProps) => {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          {ensAvatar ? (
            <img alt="Avatar" src={ensAvatar} />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-xs">
                {address ? address.slice(2, 4).toUpperCase() : '??'}
              </span>
            </div>
          )}
        </div>
      </label>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <a href={blockExplorerAddressLink} target="_blank" rel="noopener noreferrer">
            View on Explorer
          </a>
        </li>
      </ul>
    </div>
  );
};
