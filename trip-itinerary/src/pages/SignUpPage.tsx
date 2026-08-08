import '../styles/SignUp.css';

export default function SignUpPage() {
    return (
        <div>
            <h1>Set up your profile</h1>

            <div id="sign-up-form">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" placeholder="Username" />

                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" placeholder="First Name" />

                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" placeholder="Last Name" />

                <label htmlFor="email">E-mail</label>
                <input type="text" id="lastName" value="email.com (REPLACE WITH ACTUAL)" readOnly />

                <label htmlFor="residenceCountry">Country of Origin</label>
                <select id="residenceCountry">
                    <option value="">Where would you usually start trips from?</option>
                </select>
            </div>

        </div>
    );
}