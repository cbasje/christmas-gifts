<script lang="ts">
import { login } from '$lib/db/remotes/auth.remote';
</script>

<svelte:head>
    <title>Sign in</title>
</svelte:head>

<main>
    <h1>Sign in</h1>

    <form {...login}>
        <label for="form-login.username">Username</label>
        <input
            type="text"
            name="username"
            autocomplete="username"
            required
            aria-describedby="form-login.username-error"
        />

        <!-- FIXME:
    <label for="form-login.password">Password</label>
    <input
      type="password"
      name="password"
      autocomplete="current-password"
      required
      aria-describedby="form-login.password-error"
    /> -->

        <button type="submit">Continue</button>
    </form>
</main>
