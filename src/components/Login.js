import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import styles from '../styles/Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSignup) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">
                        {isSignup ? 'Sign Up' : 'Login'}
                    </button>
                </form>
                <p>
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}
                    <button
                        className={styles.toggleButton}
                        onClick={() => setIsSignup(!isSignup)}
                    >
                        {isSignup ? 'Login' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
