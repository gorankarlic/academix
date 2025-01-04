<script lang="ts" setup>
import {ref} from "vue";
import Tabs from "./Tabs.vue";
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

const tab = ref(0);
</script>
<template>
    <div class="bg-black box-border min-h-100vh grid grid-cols-[1fr_1fr] grid-rows-[min-content_min-content_1fr] grid-gap-8 font-sans p-8">
        <div class="flex flex-gap-4 flex-items-center grid-col-[1/3]">
            <div class="b-color-white b-1 b-solid b-rd-100% bg-red flex flex-items-center flex-justify-center h-10 w-10">
                <div class="i-bx:paperclip h-8 w-8"/>
            </div>
            <div class="color-white font-serif text-12">CaseInPoints</div>
        </div>
        <div class="color-white font-serif text-8">Upload or Copy Your Case Study</div>
        <div class="color-white font-serif text-8">Estimated Rating</div>
        <Tabs class="flex-grow min-h-20em" v-bind:tabs="2">
            <template v-slot:header:1>Upload PDF</template>
            <template v-slot:header:2>Paste Text</template>
            <template v-slot:tab:1>
                <Upload class="h-100% grid-items-stretch" v-on:upload="submitPDF">
                    <template v-slot:default="{choose, dragging}">
                        <div class="flex flex-gap-2 flex-items-center flex-justify-center flex-col" v-bind:class="dragging ? 'bg-white' : 'bg-white'">
                            <div class="color-red h-8 i-bxs:file-plus w-8"/>
                            <div class="flex flex-items-center flex-gap-2">
                                <div class="b-2 b-color-red b-solid b-rd-4 bg-white color-black p-x-4 p-y-2" v-on:click="choose">Upload a file</div>
                                <div>or drag and drop</div>
                            </div>
                            <div>PDF</div>
                        </div>
                    </template>
                </Upload>
            </template>
            <template v-slot:tab:2>
                <textarea class="b-none box-border font-sans max-h-100% max-w-100% min-h-100% min-w-100% h-100% p-x-2 p-y-1 text-4 w-100%" placeholder="Paste your text here" v-model="text"/>
            </template>
        </Tabs>
    </div>
</template>