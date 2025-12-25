import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "JuTemp教程",
    description: "相关服务教程合集",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [{ text: "Home", link: "/" }],

        sidebar: [
            {
                text: "相关服务教程合集",
                items: [
                    { text: "Nekobox代理导入方法", link: "/nekobox-import-sub" },
                    { text: "Nekobox代理更新方法", link: "/nekobox-update-sub" },
                    { text: "节点延迟情况", link: "/check-network-proxy-latency" },
                    { text: "ElementX第一次登陆", link: "/element-init" },
                    { text: "ElementX多设备登陆", link: "/element-multi-devices" },
                    { text: "ElementX疑难杂症", link: "/element-troubleshoot" },
                    { text: "Ntfy订阅链接", link: "/ntfy-sub" },
                ],
            },
        ],

        socialLinks: [
            { icon: "github", link: "https://github.com/JuTemp" },
            {
                icon: {
                    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2M1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.88Z"/></svg>',
                },
                link: "mailto:jtp0415@outlook.com",
            },
        ],
    },
});
