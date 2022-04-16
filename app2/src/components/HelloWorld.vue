<template>
    <div>
        <h1>{{ msg }}</h1>

        <i class="el-icon-s-promotion" />
        <p class="app-lib">
            vue version: {{ vueVersion }}, element-ui version:
            {{ elementVersion }}, i'm purple!
        </p>
    </div>
</template>

<script>
import ElementUI from "element-ui";
import Vue from "vue";

export default {
    name: "HelloWorld",
    props: {
        msg: String,
    },
    data() {
        return {
            vueVersion: Vue.version,
            elementVersion: ElementUI.version,
        };
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1 {
    color: #64b587;
}
.app-lib {
    color: purple;
}
</style>
