<script lang="ts">
import { login } from '#db/remotes/auth.remote.js';
import { m } from '#lib/paraglide/messages.js';
import { confetti } from '../../+layout.svelte';
</script>

<svelte:head>
    <title>{m.sign_in_title()}</title>
</svelte:head>

<main>
    <h1>{m.sign_in_title()}</h1>

    <form
        {...login.enhance(async ({ element, submit }) => {
            try {
                await submit();
                element.reset();

                confetti.success("Successfully logged in!");
            } catch (error) {
                confetti.error("Oh no! Something went wrong");
            }
        })}
    >
        <label for="form-login.username">{m.user_username()}</label>
        <input
            {...login.fields.username.as("text")}
            autocomplete="username"
            required
            aria-errormessage="form-login.username-error"
            data-foley-type
        />
        <div id="form-login.username-error">
            {#each login.fields.username.issues() as issue}
                <p class="issue">{issue.message}</p>
            {/each}
        </div>

        <!-- FIXME:
    <label for="form-login.password">{m.user_password()}</label>
    <input
      type="password"
      name="password"
      autocomplete="current-password"
      required
      aria-errormessage="form-login.password-error"
    /> -->

        <button type="submit" data-foley-press data-foley-release>{m.button_continue()}</button>
    </form>
</main>

<style>
    .issue {
        font-size: var(--font-size-fluid-0);
        color: var(--red-6);
    }
</style>
