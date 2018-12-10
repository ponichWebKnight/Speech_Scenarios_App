import Index from '../pages/Index'
import NotFound from '../pages/NotFound'

const other_routes = [
  {
    path: '/',
    name: 'sa.index',
    component: Index
  },
  {
    path: '*',
    name: 'sa.not_found',
    component: NotFound
  }
]

export default other_routes