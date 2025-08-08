import { useState } from 'react';
import { assignRole } from '../lib/api';

export default function AssignRole() {
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('oracle');
  const [status, setStatus] = useState('');

  const handleAssign = async () => {
    setStatus('Assigning...');
    try {
      await assignRole(address, role);
      setStatus('Role assigned successfully!');
    } catch (err) {
      setStatus('Error assigning role.');
    }
  };

  return (
    <div>
      <h2>Assign Role</h2>
      <input
        type="text"
        placeholder="zkLogin address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="oracle">Oracle</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleAssign}>Assign</button>
      <p>{status}</p>
    </div>
  );
}