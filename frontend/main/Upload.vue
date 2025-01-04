<script lang="ts" setup>
import {ref, useTemplateRef} from "vue";

interface Emits
{
    (event: "upload", bytes: ArrayBuffer): void;
}
interface Props
{
    type?: `${string}/${string}`;
}
const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {type: "application/pdf"});

const input = useTemplateRef("input");
const click = () => input.value!.click();
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
    const {type} = file ?? {type: null};
    if(type === props.type)
    {
        const bytes = await file!.arrayBuffer();
        emit("upload", bytes);
    }
};
</script>
<template>
    <div class="flex flex-col flex-items-center" v-bind:class="dragging ? 'bg-red' : 'bg-blue'" ref="div" v-on:click="click" v-on:dragleave.prevent="dragleave" v-on:dragover.prevent="dragover" v-on:drop.prevent="drop">
        <div>Choose a PDF file</div>
        <div>or</div>
        <div>Drop it here</div>
        <input class="hidden" ref="input" type="file" v-on:input="select" />
    </div>
</template>