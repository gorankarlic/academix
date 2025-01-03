import {defineConfig, type UserConfig} from "unocss";
import {presetIcons} from "@unocss/preset-icons";
import {presetUno} from "@unocss/preset-uno";
import {presetWebFonts} from "@unocss/preset-web-fonts";

const config: UserConfig =
{
    presets:
    [
        presetIcons(),
        presetUno(),
        presetWebFonts()
    ]
}

export default defineConfig(config)