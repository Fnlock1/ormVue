<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import {db} from "@/utils"; // 引入db插件
import {onMounted} from "vue";

let userdb = db("127.0.0.1", "8000").prefix("api/v1/") // 前缀 设置端口 和默认前缀


onMounted(async () => {
    let user = await userdb.collection('xy') // 可以理解为数据库对象
        .whereIn('id', [1, 2, 3]) // 查询携带参数
        .whereIn('name', ['xy', 'xy2'])
        .where("name", "like")
        .sql("select * from xy where id in (1,2,3) and name in ('xy','xy2') and name like '%xy%'") // 自定义sql 语句


    if (!user) { // 如果 要求的内容不存在

    }

})

</script>

<template>
    <header>
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125"/>

        <div class="wrapper">
            <HelloWorld msg="You did it!"/>

            <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
            </nav>
        </div>
    </header>

    <RouterView/>
</template>

<style scoped>
header {
    line-height: 1.5;
    max-height: 100vh;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
