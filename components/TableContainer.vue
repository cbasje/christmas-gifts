<template>
    <div class="table-container flex flex-col gap-5 container mt-5 px-3">
        <slot />
    </div>
</template>

<style>
.table-container {
    --gradient-size-start: max(0.75rem, env(safe-area-inset-left));
    --gradient-size-end: 0px;
}

@media (max-width: 688px) {
    .table-container {
        --gradient-size-start: 0.75rem;
        --gradient-size-end: 10%;

        position: relative;
        left: 50%;
        margin-left: -50vw;
        width: 100vw;
        overflow-x: auto;

        -webkit-mask-image: linear-gradient(
            to right,
            transparent 0,
            #000 var(--gradient-size-start),
            #000 calc(100% - var(--gradient-size-end)),
            transparent 100%
        );
        mask-image: linear-gradient(
            to right,
            transparent 0,
            #000 var(--gradient-size-start),
            #000 calc(100% - var(--gradient-size-end)),
            transparent 100%
        );
    }
}
</style>
