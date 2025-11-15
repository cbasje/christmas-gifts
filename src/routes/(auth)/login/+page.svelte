<script lang="ts">
import { login } from '$lib/db/remotes/auth.remote';
import { m } from '$lib/paraglide/messages';
</script>

<svelte:head>
    <title>{m.sign_in_title()}</title>
</svelte:head>

<main>
    <h1>{m.sign_in_title()}</h1>

    <form {...login}>
        <label for="form-login.username">{m.user_username()}</label>
        <input
            type="text"
            name="username"
            autocomplete="username"
            required
            aria-describedby="form-login.username-error"
        />

        <!-- FIXME:
    <label for="form-login.password">{m.user_password()}</label>
    <input
      type="password"
      name="password"
      autocomplete="current-password"
      required
      aria-describedby="form-login.password-error"
    /> -->

        <button type="submit">{m.button_continue()}</button>
    </form>
</main>
