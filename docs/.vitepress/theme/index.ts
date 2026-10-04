import DefaultTheme from "vitepress/theme";
import GradientCard from "./components/GradientCard.vue";
import ContrastCard from "./components/ContrastCard.vue";

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        // 全局注册组件
        app.component("GradientCard", GradientCard);
        app.component("ContrastCard", ContrastCard);
    },
};
