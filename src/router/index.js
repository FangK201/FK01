import { createRouter, createWebHistory } from 'vue-router'
import Home from '../view/home.vue'
import Overview from '../view/Overview.vue'
import Settings from '../view/Setting.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/overview', component: Overview },
  { path: '/settings', component: Settings }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
// import { createRouter, createWebHistory } from 'vue-router'
// // import home from '../view/home.vue' 
// import Home from '../view/home.vue'

// const routes = [
//   { path: '/', component: Home }
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })

// export default router