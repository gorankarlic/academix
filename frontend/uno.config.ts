import {defineConfig, type UserConfig} from "unocss";
import {presetIcons} from "@unocss/preset-icons";
import {presetUno} from "@unocss/preset-uno";
import {presetWebFonts, type WebFontsOptions} from "@unocss/preset-web-fonts";

const fonts: WebFontsOptions =
{
    fonts:
    {
        serif: "DM Serif Text",
        sans: "DM Sans"
    },
    provider: "google"
};

const config: UserConfig =
{
    presets:
    [
        presetIcons(),
        presetUno(),
        presetWebFonts(fonts)
    ]
}

export default defineConfig(config)