import {defineConfig, type UserConfig} from "vite";
import unocss from "unocss/vite";
import vue from "@vitejs/plugin-vue";

await import("dotenv/config");
await import("dotenv-expand/config");

const config: UserConfig =
{
    build:
    {
        emptyOutDir: true,
        outDir: "../target/build"
    },
    plugins:
    [
        unocss(),
        vue()
    ],
    root: "./main"
};

export default defineConfig(config);