const Login = () => import('@/views/Login.vue')
const Home = () => import('@/views/Home.vue')
const Welcome = () => import('@/views/Welcome.vue')
const Users = () => import('@/views/user/Users.vue')
const Rights = () => import('@/views/power/Rights.vue')
const Roles = () => import('@/views/power/Roles.vue')
const Cate = () => import('@/views/goods/Cate.vue')
const Params = () => import('@/views/goods/Params.vue')
const List = () => import('@/views/goods/List.vue')
const Add = () => import('@/views/goods/Add.vue')
const Order = () => import('@/views/order/Order.vue')
const Report = () => import('@/views/report/Report.vue')

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }
    ]

  }
]

export default routes
