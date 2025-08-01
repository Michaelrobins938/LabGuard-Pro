import React, { useState, useEffect } from 'react';

const Profile = () => {
    const [user, setUser] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [character, setCharacter] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        fetch('/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => setUser(data));
    }, []);

    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleAvatarUpload = () => {
        const token = sessionStorage.getItem('token');
        const formData = new FormData();
        formData.append('avatar', avatar);

        fetch('/api/user/avatar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
        .then(response => {
            if (response.ok) {
                alert('Avatar uploaded successfully');
            } else {
                alert('Failed to upload avatar');
            }
        });
    };

    const handleCharacterUpdate = () => {
        const token = sessionStorage.getItem('token');
        fetch('/api/user/character', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ character })
        })
        .then(response => {
            if (response.ok) {
                alert('Character updated successfully');
            } else {
                alert('Failed to update character');
            }
        });
    };

    return (
        <div>
            <h2>Profile</h2>
            <p>Username: {user.username}</p>
            {user.avatar && <img src={`/${user.avatar}`} alt="Avatar" />}
            <input type="file" onChange={handleAvatarChange} />
            <button onClick={handleAvatarUpload}>Upload Avatar</button>

            <h3>Character Customization</h3>
            <input
                type="text"
                placeholder="Character Name"
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
            />
            <button onClick={handleCharacterUpdate}>Update Character</button>
        </div>
    );
};

export default Profile;
