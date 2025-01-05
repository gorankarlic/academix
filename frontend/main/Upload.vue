<script lang="ts" setup>
import {ref, useTemplateRef} from "vue";

interface Emits
{
    (event: "upload", bytes: ArrayBuffer, name: string): void;
}
interface Props
{
    type?: `${string}/${string}`;
}
const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {type: "application/pdf"});
defineSlots<{default: (_: {choose: () => void, dragging: boolean}) => any}>();

const input = useTemplateRef("input");
const choose = () => input.value!.click();
const select = async () =>
{
    const [file] = input.value!.files!;
    upload(file);
};

const dragging = ref(false);
const dragleave = () => dragging.value = false;
const dragover = () => dragging.value = true;
const drop = async (event: DragEvent) =>
{
    try
    {
        const {dataTransfer} = event;
        const {files: [file]} = dataTransfer ?? {files: []};
        upload(file);
    }
    finally
    {        
        dragging.value = false;
    }
};

const upload = async (file: File | undefined) =>
{
    const {name, type} = file ?? {type: null};
    if(type === props.type)
    {
        const bytes = await file!.arrayBuffer();
        emit("upload", bytes, name);
    }
};
</script>
<template>
    <div class="grid grid-col-[1fr] grid-row-[1fr]" ref="div" v-on:dragleave.prevent="dragleave" v-on:dragover.prevent="dragover" v-on:drop.prevent="drop">
        <slot name="default" v-bind:dragging="dragging" v-bind:choose="choose"/>
        <input class="hidden" ref="input" type="file" v-on:input="select" />
    </div>
</template>