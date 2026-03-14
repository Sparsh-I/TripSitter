import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
    return (
        <div className="login-background">
            <div className="login-page">
                <h1>Sign in to continue</h1>
                <GoogleLogin
                    onSuccess={(response) => {
                        const user = jwtDecode(response.credential!);
                        console.log(user);
                    }}
                    onError={() => console.log('Login failed')}
                />
            </div>
        </div>
    );
}