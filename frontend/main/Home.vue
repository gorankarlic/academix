<script lang="ts" setup>
import {ref} from "vue";
import Upload from "./Upload.vue";

const {VITE_API_URL} = import.meta.env;

const submit = async (bytes: ArrayBuffer | Uint8Array, type: "application/pdf" | "text/plain") =>
{
    const opts =
    {
        body: bytes,
        headers:
        {
            "Content-Type": "application/octet-stream",
            "X-Content-Type": type
        },
        method: "POST"
    };
    const response = await fetch(`${VITE_API_URL}/upload/`, opts);
    const data = await response.json();
    console.log(data);
};

const submitPDF = async (pdf: ArrayBuffer) => await submit(pdf, "application/pdf");

const text = ref("");
const submitText = async () => await submit(new TextEncoder().encode(text.value), "text/plain");
</script>
<template>
    <h1>App</h1>
    {{ VITE_API_URL }}
    <Upload v-on:upload="submitPDF"/>
    <textarea class="box-border max-w-100% min-h-10em min-w-100% w-100%" v-model="text"/>
    <button class="bg-blue" v-on:click="submitText">Submit</button>
</template>