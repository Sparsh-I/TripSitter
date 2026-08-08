export default function SignUpPage() {
    return (
        <div>
            <h1>Set up your profile</h1>

            <label htmlFor="username">Username</label>
            <input type="text" name="username" placeholder="Username" />

            <label htmlFor="firstName">First Name</label>
            <input type="text" name="firstName" placeholder="First Name" />

            <label htmlFor="lastName">Last Name</label>
            <input type="text" name="lastName" placeholder="Last Name" />

            <label htmlFor="email">E-mail</label>
            <input type="text" name="lastName" value="email.com (REPLACE WITH ACTUAL)" readOnly />
        </div>
    );
}