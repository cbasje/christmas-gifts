<script lang="ts">
import type { UserSizes } from '#db/models.js';
import { m } from '#lib/paraglide/messages.js';
import SizeChartSimple from './SizeChartSimple.svelte';
import SizeChartSimpleEmpty from './SizeChartSimpleEmpty.svelte';

type Props = { sizes: UserSizes | null | undefined };
let { sizes }: Props = $props();

const simpleRows = $derived([
    { label: m.size_chart_areas_simple_top(), value: sizes?.simple?.top },
    { label: m.size_chart_areas_simple_bottom(), value: sizes?.simple?.bottom },
    { label: m.size_chart_areas_simple_shoe(), value: sizes?.simple?.shoe },
]);

const advancedRows = $derived([
    { label: m.size_chart_areas_advanced_head(), value: sizes?.advanced?.head },
    { label: m.size_chart_areas_advanced_sleeve(), value: sizes?.advanced?.sleeve },
    { label: m.size_chart_areas_advanced_chest(), value: sizes?.advanced?.chest },
    { label: m.size_chart_areas_advanced_waist(), value: sizes?.advanced?.waist },
    { label: m.size_chart_areas_advanced_hip(), value: sizes?.advanced?.hip },
    { label: m.size_chart_areas_advanced_inseam(), value: sizes?.advanced?.inseam },
]);

const hasSizes = $derived([...simpleRows, ...advancedRows].some((row) => row.value));
</script>

<div class="size-chart">
    <div class="figure">
        <SizeChartSimple />
        <SizeChartSimpleEmpty />
    </div>

    {#if hasSizes}
        <div class="groups">
            <dl>
                {#each simpleRows as row}
                    <div>
                        <dt>{row.label}</dt>
                        <dd>{row.value || "–"}</dd>
                    </div>
                {/each}
            </dl>

            <dl>
                {#each advancedRows as row}
                    <div>
                        <dt>{row.label}</dt>
                        <dd>{row.value || "–"}</dd>
                    </div>
                {/each}
            </dl>
        </div>
    {:else}
        <p class="empty">{m.size_chart_empty()}</p>
    {/if}
</div>

<style>
    .size-chart {
        display: grid;
        gap: var(--size-relative-3);

        @media (min-width: 768px) {
            grid-template-columns: minmax(0, 340px) 1fr;
            align-items: start;
        }

        .figure {
            max-inline-size: 340px;
            color: var(--text-2);
        }

        .groups {
            display: flex;
            flex-wrap: wrap;
            gap: var(--size-relative-3);

            dl {
                flex: 1 1 220px;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;
                gap: var(--size-1);

                > div {
                    display: grid;
                    grid-template-columns: 1fr auto;
                    align-items: baseline;
                    gap: var(--size-relative-2);
                    padding: var(--size-1) var(--size-relative-2);
                    background: var(--surface-2);
                    border-radius: var(--radius-2);

                    dt {
                        color: var(--text-2);
                        font-size: var(--font-size-fluid-0);
                    }

                    dd {
                        margin: 0;
                        font-weight: var(--font-weight-6);
                    }
                }
            }
        }

        .empty {
            color: var(--text-2);
            font-size: var(--font-size-fluid-0);
        }
    }
</style>