import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { getCurrentUser } from '../services/auth';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await API.get(`/users/${user.userId}`); // Fetch profile by user ID
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    fetchProfile();
  }, [user.userId]);

  const handleFileChange = (e) => {
    setNewProfilePic(e.target.files[0]);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    if (newProfilePic) {
      formData.append('profile_picture', newProfilePic);
    }
    
    try {
      const updatedProfile = {
        name: e.target.name.value,
        email: e.target.email.value,
        role: e.target.role.value,
      };
      
      // Include profile picture if changed
      if (newProfilePic) {
        await API.post(`/users/${user.userId}/upload-profile`, formData);
      }
      
      await API.put(`/users/${user.userId}`, updatedProfile);
      setProfile((prevState) => ({
        ...prevState,
        ...updatedProfile,
        profile_picture: newProfilePic ? URL.createObjectURL(newProfilePic) : prevState.profile_picture,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={styles.container}>
      <h2>Profile</h2>
      {profile.profile_picture && (
        <img
          src={profile.profile_picture.startsWith('http') 
            ? profile.profile_picture 
            : `${import.meta.env.VITE_API_URL}/${profile.profile_picture}`}  // Use import.meta.env for Vite
          alt="Profile"
          style={{ width: '100px', height: '100px', borderRadius: '50%' }}
        />
      )}
      
      {isEditing ? (
        <form onSubmit={handleProfileUpdate}>
          <div style={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={profile.name}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={profile.email}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="role">Role</label>
            <input
              type="text"
              id="role"
              name="role"
              defaultValue={profile.role}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="profile_picture">Profile Picture</label>
            <input
              type="file"
              id="profile_picture"
              name="profile_picture"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit">Save Changes</button>
        </form>
      ) : (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <button onClick={handleEditToggle}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
  },
  formGroup: {
    marginBottom: '1rem',
  },
};

export default Profile;
