// src/components/Profile.jsx
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { getCurrentUser } from '../services/auth';

function Profile() {
  const [profile, setProfile] = useState(null);
  const user = getCurrentUser();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await API.get('/users/profile');
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    fetchProfile();
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={styles.container}>
      <h2>Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>
      {/* Add more profile details or edit functionality as needed */}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
  },
};

export default Profile;
