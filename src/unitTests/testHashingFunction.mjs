import { hash } from 'bcrypt';


async function hashAndInsertUser(username, password, email, userType) {
        const hashedPassword = await hash(password, 10); // Hash the password
        console.log(`Hashed password for ${username}: ${hashedPassword}`);
    
}

// Manually add users with hashed passwords
hashAndInsertUser('admin1', 'admin1@gmail.com', 'password1', 'Admin');
hashAndInsertUser('user2', 'user2@gmail.com', 'password2', 'User');
