<script generic="T extends 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9" lang="ts" setup>
type Index<T extends 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9> = T extends 1 ? 1 : T extends 2 ? 1 | 2 : T extends 3 ? 1 | 2 | 3 : T extends 4 ? 1 | 2 | 3 | 4 : T extends 5 ? 1 | 2 | 3 | 4 | 5 : T extends 6 ? 1 | 2 | 3 | 4 | 5 | 6 : T extends 7 ? 1 | 2 | 3 | 4 | 5 | 6 | 7 : T extends 8 ? 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 : 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface Props
{
    tabs: T;
}

const tab = defineModel<Index<T>>("tab", {required: true});
defineProps<Props>();
defineSlots<{[K in `header:${Index<T>}`]: () => {}} & {[K in `tab:${Index<T>}`]: () => {}}>();

const select = (index: Index<T>) => tab.value = index;
</script>
<template>
    <div class="grid grid-cols-[1fr] grid-rows-[max-content_1fr]">
        <div class="color-black grid" v-bind:style="{gridTemplateColumns: `repeat(${tabs},max-content)`}">
            <div class="b-rd-t-4 cursor-pointer p-4" v-bind:class="tab === index ? 'bg-paper' : 'bg-white'" v-bind:key="index" v-on:click="select(index as Index<T>)" v-for="index of tabs">
                <slot v-bind:name="`header:${index as Index<T>}`"/>
            </div>
        </div>
        <template v-bind:key="index" v-for="index of tabs">
            <div class="bg-red grid-col-[1/1] grid-row-[2/2]" v-if="tab === index">
                <slot v-bind:name="`tab:${index as Index<T>}`"/>
            </div>
        </template>
    </div>
</template>