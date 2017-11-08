import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Intro = resolve => require(['../components/intro.vue'], resolve);
const Index = resolve => require(['../components/index.vue'], resolve);
const oasIndex = resolve => require(['../components/oasIndex.vue'], resolve);
const TBPGames = resolve => require(['../components/contentpage/takeByPasswd.vue'], resolve);
const searchOnly = resolve => require(['../components/contentpage/searchOnly.vue'], resolve);
const NotFoundComponent = resolve => require(['../components/404.vue'], resolve);
const router = new VueRouter({
    mode: "history",
	routes: [
		{
            path: '/',
            component: Intro
        },
        {
            path: '/index',
            component: Index,
            children: [
                //主页
                {
                    path: '/tbpgames/:game',
                    component: TBPGames
                },
            ]
        },
        {
            path: '/oasindex',
            component: oasIndex,
            children: [
                //主页
                {
                    path: '/searchonly/:game/:lang',
                    component: searchOnly
                },
            ]
        },
        {   path: '*', 
            component: NotFoundComponent
        },
    ]
});

export default router;