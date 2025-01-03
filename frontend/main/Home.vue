<script lang="ts" setup>
import {useTemplateRef} from "vue";

const {VITE_API_URL} = import.meta.env;

const input = useTemplateRef("input");
const upload = async () =>
{
    const [file] = input.value!.files!;
    const bytes = await file.arrayBuffer();
    const opts =
    {
        body: bytes,
        headers:
        {
            "Content-Type": "application/octet-stream"
        },
        method: "POST"
    };
    const response = await fetch(`${VITE_API_URL}/upload/`, opts);
    const data = await response.json();
    console.log(data);
}
</script>
<template>
    <h1>App</h1>
    {{ VITE_API_URL }}
    <input ref="input" type="file" v-on:input="() => upload()" />
</template>