<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - LitRPG Unlimited</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    <style>
        .dashboard {
            padding: 2rem 1rem;
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .dashboard h2 {
            margin-bottom: 1rem;
        }

        .achievements,
        .quests {
            margin: 1rem 0;
            width: 80%;
            max-width: 600px;
        }

        .achievement,
        .quest {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
            text-align: center;
        }

        .progress-bar {
            background: #fff;
            border-radius: 5px;
            overflow: hidden;
            margin: 1rem 0;
        }

        .progress-bar-inner {
            background: #ff4500;
            height: 20px;
            width: 50%;
            transition: width 0.3s;
        }
    </style>
</head>
<body>
    <header class="animate-header">
        <h1>Profile</h1>
        <nav id="navbar" aria-label="Main navigation">
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="subscription.html">Subscription Plans</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact Us</a></li>
                <li><a href="library.html">Library</a></li>
                <li><a href="new-releases.html">New Releases</a></li>
                <li><a href="music.html">Music</a></li>
                <li><a href="testimonials.html">Testimonials</a></li>
                <li><a href="forum.html">Forum</a></li>
                <li><a href="profile.html">Profile</a></li>
                <li><a href="login.html">Login</a></li>
                <li><a href="register.html">Register</a></li>
            </ul>
            <div class="social-icons">
                <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-linkedin"></i></a>
            </div>
        </nav>
    </header>

    <section class="dashboard animate-section">
        <h2>Welcome, [Username]!</h2>
        <div class="achievements">
            <h3>Achievements</h3>
            <div class="achievement">
                <h4>Bookworm</h4>
                <p>Read 10 books.</p>
                <div class="progress-bar">
                    <div class="progress-bar-inner" style="width: 70%;"></div>
                </div>
            </div>
            <!-- Add more achievements as needed -->
        </div>
        <div class="quests">
            <h3>Quests</h3>
            <div class="quest">
                <h4>First Steps</h4>
                <p>Complete your profile.</p>
                <div class="progress-bar">
                    <div class="progress-bar-inner" style="width: 50%;"></div>
                </div>
            </div>
            <!-- Add more quests as needed -->
        </div>
        <form id="profile-form">
            <input type="text" placeholder="Username" aria-label="Username" required>
            <input type="email" placeholder="Email" aria-label="Email" required>
            <textarea placeholder="Bio" rows="5" aria-label="Bio"></textarea>
            <button type="submit">Update Profile</button>
        </form>
    </section>

    <footer>
        <div class="footer-content">
            <div class="social-icons">
                <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-linkedin"></i></a>
            </div>
            <div class="footer-links">
                <a href="#privacy">Privacy Policy</a> |
                <a href="#terms">Terms of Service</a> |
                <a href="contact.html">Contact Us</a>
            </div>
            <p>&copy; 2024 LitRPG Unlimited. All rights reserved.</p>
        </div>
    </footer>

    <script>
       document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startProfileCreation');
    const characterOptions = document.getElementById('character-options');
    const genderOptions = document.getElementById('gender-options');
    const profileSection = document.getElementById('profile');

    startButton.addEventListener('click', function() {
        characterOptions.style.display = 'block';
        genderOptions.style.display = 'none';
        profileSection.style.display = 'none';
    });

    characterOptions.addEventListener('click', (e) => {
        if (e.target.classList.contains('character-option')) {
            const character = e.target.dataset.character;
            localStorage.setItem('character', character);
            characterOptions.style.display = 'none';
            genderOptions.style.display = 'block';
        }
    });

    genderOptions.addEventListener('click', (e) => {
        if (e.target.classList.contains('gender-option')) {
            const gender = e.target.dataset.gender;
            const character = localStorage.getItem('character');
            fetch('/select-character', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.split('=')[1]}`
                },
                body: JSON.stringify({ character, gender })
            }).then(response => response.json())
              .then(data => {
                  if (data.user) {
                      profileSection.style.display = 'block';
                      document.getElementById('username').innerText = data.user.username;
                      document.getElementById('profile-pic').src = `/uploads/${data.user.character}.png`;
                      document.getElementById('static-character-img').src = `/uploads/${data.user.character}.png`;
                      genderOptions.style.display = 'none';
                  }
              });
        }
    });

    fetch('/profile', {
        headers: {
            'Authorization': `Bearer ${document.cookie.split('=')[1]}`
        }
    }).then(response => response.json())
      .then(user => {
          if (user) {
              profileSection.style.display = 'block';
              document.getElementById('username').innerText = user.username;
              document.getElementById('level').innerText = user.level;
              document.getElementById('experience').innerText = user.experience;
              document.getElementById('profile-pic').src = `/uploads/${user.character}.png`;
              document.getElementById('static-character-img').src = `/uploads/${user.character}.png`;
          }
      });

    socket.on('profileUpdated', (user) => {
        document.getElementById('level').innerText = user.level;
        document.getElementById('experience').innerText = user.experience;
        document.getElementById('achievements').innerHTML = '';
        user.achievements.forEach(achievement => {
            const img = document.createElement('img');
            img.src = achievement ? 'unlocked.png' : 'locked.png';
            document.getElementById('achievements').appendChild(img);
        });
    });
});
    </script>
</body>
</html>
