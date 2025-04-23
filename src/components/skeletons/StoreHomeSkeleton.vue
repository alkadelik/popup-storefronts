<template>
    <div class="p-4 h-screen overflow-hidden">
        <div class="py-3 flex items-center gap-3">
            <Skeleton width="4.5rem" height="4.5rem" class="mb-2"></Skeleton>

            <div class="flex flex-col gap-1 h-16 justify-between">
                <Skeleton width="8rem" height="1.7rem"></Skeleton>
                <Skeleton width="6rem" height="1.2rem"></Skeleton>
            </div>
        </div>
        <div class="flex gap-3 py-6">
            <Skeleton height="2rem" class="w-9/12"></Skeleton>
            <Skeleton height="2rem" width="2rem"></Skeleton>
            <Skeleton height="2rem" width="2rem"></Skeleton>
        </div>

        <section>
            <div class="flex flex-wrap gap-1">
                <Skeleton class="w-[32.5%] h-32 mb-0.5 rounded-sm" v-for="_ in 12"></Skeleton>
            </div>
        </section>
    </div>
</template>
<script setup></script>
