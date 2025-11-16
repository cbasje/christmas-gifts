<script lang="ts">
import { getPreview } from '$lib/db/remotes/link.remote';
import { m } from '$lib/paraglide/messages';

type Props = { link: string | null | undefined };
let { link }: Props = $props();

let preview = $derived(getPreview(link));
</script>

{#if preview.loading}
    {m.loading()}
{:else if preview.current && link}
    {@const header = preview.current.ogImage?.at(0)}
    {@const url = new URL(preview.current.ogUrl || link)}
    <a
        href={url.toString()}
        target="_blank"
        rel="noopener noreferrer"
        class="preview"
    >
        {#if header}
            <img
                src={new URL(
                    header.url,
                    preview.current.ogUrl || link || undefined,
                ).toString()}
                alt={header.alt}
                width={1200}
                height={600}
                class="header"
            />
        {/if}
        {#if preview.current.favicon}
            <img
                src={new URL(
                    preview.current.favicon,
                    preview.current.ogUrl || link || undefined,
                ).toString()}
                alt="Favicon of link"
                class="favicon"
            />
        {/if}
        <p class="title">{preview.current.ogTitle}</p>
        {#if preview.current.ogDescription}
            <p class="description">{preview.current.ogDescription}</p>
        {/if}
        <p class="url">{url.host}</p>
    </a>
{/if}

<style>
    .preview {
        display: grid;
        grid-template-columns: 32px 1fr;
        align-items: center;
        row-gap: var(--size-1);
        column-gap: var(--size-2);
        padding: var(--size-2);

        background: var(--surface-1);
        font-size: var(--font-size-0);

        img.header {
            grid-column: 1 / -1;

            height: auto;
            object-fit: contain;
            aspect-ratio: 1200/600;
        }
        img.favicon {
            grid-column: 1;
            grid-row: span 3;

            width: 48px;
            height: 48px;
            object-fit: contain;
            aspect-ratio: 1;
        }
        p {
            grid-column: 2;

            max-inline-size: unset;
            height: 1lh;

            text-wrap: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            &.url {
                font-size: var(--font-size-00);
            }
        }
    }
</style>
