<script lang="ts">
import { login } from '$lib/db/remotes/auth.remote';
import { m } from '$lib/paraglide/messages';
import toast from 'svelte-french-toast';
</script>

<svelte:head>
    <title>{m.sign_in_title()}</title>
</svelte:head>

<main>
    <h1>{m.sign_in_title()}</h1>

    <form
        {...login.enhance(async ({ form, data, submit }) => {
            try {
                await submit();
                form.reset();

                toast.success("Successfully logged in!");
            } catch (error) {
                toast.error("Oh no! Something went wrong");
            }
        })}
    >
        <label for="form-login.username">{m.user_username()}</label>
        <input
            {...login.fields.username.as("text")}
            autocomplete="username"
            required
            aria-errormessage="form-login.username-error"
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

        <button type="submit">{m.button_continue()}</button>
    </form>
</main>

<style>
    .issue {
        font-size: var(--font-size-0);
        color: var(--red-6);
    }
</style>
