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
        const { data } = await API.get(`/users/${user.userId}`); 
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
      <h2 style={styles.heading}>Your Profile</h2>
      <div style={styles.profilePicContainer}>
        {profile.profile_picture && (
          <img
            src={profile.profile_picture.startsWith('http') 
              ? profile.profile_picture 
              : `${import.meta.env.VITE_API_URL}/${profile.profile_picture}`}  
            alt="Profile"
            style={styles.profilePic}
          />
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleProfileUpdate} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={profile.name}
              required
              style={styles.input}
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
              style={styles.input}
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
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="profile_picture">Profile Picture</label>
            <input
              type="file"
              id="profile_picture"
              name="profile_picture"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
          </div>
          <button type="submit" style={styles.button}>Save Changes</button>
        </form>
      ) : (
        <div style={styles.details}>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <button onClick={handleEditToggle} style={styles.editButton}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
  },
  profilePicContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  profilePic: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  input: {
    padding: '0.8rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  fileInput: {
    padding: '0.8rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '0.8rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  details: {
    textAlign: 'center',
  },
  editButton: {
    padding: '0.8rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem',
    transition: 'background-color 0.3s',
  },
};

export default Profile;
