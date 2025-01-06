<script lang="ts" setup>
import {computed, ref} from "vue";
import {Titles, type Type, type Result, Grades} from "../../backend/main/API.js";
import Tabs from "./Tabs.vue";
import Upload from "./Upload.vue";

const {VITE_API_URL} = import.meta.env;

const cached = ref<ArrayBuffer>();
const filename = ref<string>();
const uploadPDF = async (bytes: ArrayBuffer, name: string) =>
{
    cached.value = bytes;
    filename.value = name;
};

const tab = ref<1 | 2>(1);
const text = ref("");
const submit = async () =>
{
    if(tab.value === 1)
    {
        await grade(cached.value!, "pdf");
    }
    else
    {
        await grade(new TextEncoder().encode(text.value), "text");
    }
};

const result = ref<Result>();
const working = ref(false);
const grade = async (bytes: ArrayBuffer | Uint8Array, type: Type) =>
{
    working.value = true;
    try
    {
        const opts =
        {
            body: bytes,
            headers:
            {
                "Content-Type": "application/octet-stream"
            },
            method: "POST"
        };
        const response = await fetch(`${VITE_API_URL}/upload/?type=${type}`, opts);
        const data = await response.json();
        result.value = data;
    }
    finally
    {
        working.value = false;
    }
};

const average = computed(() =>
{
    if(result.value === undefined)
    {
        return null;
    }
    else
    {
        const grades = Object.values(result.value).map((grade) => numeric(grade)).flatMap((grade) => grade === null ? [] : [grade]);
        const sum = grades.reduce((sum, grade) => sum + grade, 0);
        if(grades.length === 0)
        {
            return null;
        }
        else
        {
            return sum / grades.length;
        }
    }
});

const disabled = computed(() => tab.value === 1 ? filename.value === undefined || working.value : text.value === "" || working.value);

const numeric = (grade: typeof Grades[keyof typeof Grades]) =>
{
    return Object.entries(Grades).reduce<number | null>((result, [key, value]) => value === grade ? Number(key) : result, null);
};

const reset = () =>
{
    cached.value = undefined;
    filename.value = undefined;
};
</script>
<style lang="css">
.test
{
    background: repeating-linear-gradient(to right, white 0%, rgb(217 87 87) 50%, white 100%);
    background-size: 200% auto;
    background-position-x: 100%;
}
@keyframes working
{
    0%
    {
        background-position-x: 200%;
    }
    100%
    {
        background-position-x: 0%;
    }
}
</style>
<template>
    <div class="bg-black box-border min-h-100vh grid grid-cols-[1fr_1fr] grid-rows-[min-content_min-content_1fr_min-content] grid-gap-8 font-sans p-8">
        <div class="flex flex-gap-4 flex-items-center grid-col-[1/3]">
            <div class="b-color-white b-1 b-solid b-rd-100% bg-red flex flex-items-center flex-justify-center h-18 w-18">
                <div class="color-white i-bx:paperclip h-14 rotate-290 w-14"/>
            </div>
            <div class="color-white font-serif text-8">case<span class="color-red">inpoints</span></div>
        </div>
        <div class="color-white font-serif text-6">Upload or Copy Your Impact Case Study</div>
        <div class="color-white font-serif text-6">
            <template v-if="result || working">Estimated Rating</template>
        </div>
        <Tabs class="flex-grow min-h-20em" v-model:tab="tab" v-bind:tabs="2">
            <template v-slot:header:1>Upload PDF</template>
            <template v-slot:header:2>Paste Text</template>
            <template v-slot:tab:1>
                <Upload class="h-100% grid-items-stretch" v-on:upload="uploadPDF">
                    <template v-slot:default="{choose, dragging}">
                        <div class="flex flex-wrap flex-gap-2 flex-items-center flex-justify-center" v-bind:class="[dragging ? 'bg-paper' : 'bg-paper', filename === undefined ? 'flex-col' : 'flex-row']">
                            <template v-if="filename">
                                <div class="color-red h-8 i-bxs:file-pdf w-8"/>
                                <div>{{filename}}</div>
                                <div class="cursor-pointer color-gray h-6 hover-filter-brightness-125 i-bx:bxs-x-circle w-6" v-on:click="reset"/>
                            </template>
                            <template v-else>
                                <div class="color-red h-12 i-bxs:file-plus w-12"/>
                                <div class="flex flex-items-center flex-gap-2">
                                    <div class="b-2 b-color-red b-solid b-rd-100vmax bg-white color-black cursor-pointer hover-filter-brightness-125 p-x-4 p-y-2" v-on:click="choose">Upload a file</div>
                                    <div>or drag and drop</div>
                                </div>
                                <div>PDF</div>
                            </template>
                        </div>
                    </template>
                </Upload>
            </template>
            <template v-slot:tab:2>
                <textarea class="b-none bg-paper box-border font-sans max-h-100% max-w-100% min-h-100% min-w-100% h-100% p-x-2 p-y-1 text-4 w-100%" placeholder="Paste your text here" v-model="text"/>
            </template>
        </Tabs>
        <div class="flex flex-gap-2 flex-items-center flex-col flex-justify-start">
            <div class="color-red font-italic font-serif text-12">
                <template v-if="working">Generating rating...</template>
                <template v-else-if="result">{{average ?? "-"}}</template>
            </div>
            <template v-bind:key="index" v-for="(section, index) of Titles">
                <template v-if="working">
                    <div class="animate-ease-linear animate-duration-3s animate-iteration-infinite animate-name-working b-rd-100vmax bg-gradient-repeating-linear-[(to_right,white_0%,rgb(217_87_87)_50%,white_100%)] bg-size-[200%_auto] h-1lh var-x-0 w-100% text-5"/>
                </template>
                <template v-else-if="result">
                    <div class="color-white flex flex-gap-2 flex-items-center self-start text-5">
                        <span class="h-6 i-bxs:magic-wand inline-block w-6"/>
                        <span>{{section}}</span>
                        <span class="color-red">{{numeric(result[section]) ?? "-"}}</span>
                    </div>
                </template>
            </template>
        </div>
        <div class="flex flex-items-center flex-justify-center">
            <div class="aria-disabled-hover-cursor-default aria-disabled-hover-filter-none aria-disabled-opacity-50 bg-red b-rd-100vmax box-border color-white cursor-default flex flex-items-center flex-justify-center font-serif hover-filter-brightness-125 hover-cursor-pointer min-w-60 p-x-4 p-y-2.5 self-center text-5" v-bind:aria-disabled="disabled" v-on:click="submit">
                <span>Get Rating</span>
            </div>
        </div>
    </div>
</template>