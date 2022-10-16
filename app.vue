<template>
    <div class="bg-gray-100 dark:bg-gray-900 h-screen overflow-scroll">
        <Head>
            <Title>Christmas Gifts</Title>
            <Meta
                name="description"
                content="Christmas gifts tracker for Benjamins & Haugens"
            />
            <Meta
                name="theme-color"
                content="white"
                media="(prefers-color-scheme: light)"
            />
            <Meta
                name="theme-color"
                content="#27272A"
                media="(prefers-color-scheme: dark)"
            />
            <Link rel="manifest" href="/app.webmanifest" />
            <Link rel="apple-touch-icon" href="/images/icon-ios.png" />
        </Head>

        <NuxtPage />
    </div>
</template>
