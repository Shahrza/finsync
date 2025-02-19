import NextLink from "next/link";

import { login } from "./actions";

export default function LoginPage() {
  return (
    <form>
      <label htmlFor="fullName">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <NextLink href="/auth/register">Sign up</NextLink>
    </form>
  );
}
