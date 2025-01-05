import {defineConfig, type UserConfig} from "unocss";
import {presetIcons} from "@unocss/preset-icons";
import {presetUno} from "@unocss/preset-uno";
import {presetWebFonts, type WebFontsOptions} from "@unocss/preset-web-fonts";

const fonts: WebFontsOptions =
{
    fonts:
    {
        sans: "DM Sans",
        serif: "DM Serif Text"
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
    ],
    theme:
    {
        colors:
        {
            "paper": "#F6F2E9",
            "red": "#D95757"
        }
    }
}

export default defineConfig(config)