import Type from '../pages/widget/Type'
import Total from '../pages/widget/Total'
import Assistant from '../pages/widget/Assistant'
import ActiveAssistants from '../pages/widget/ActiveAssistants'
import NotFound from '../pages/NotFound'

const widget_routes = [
  {
    path: '/widget',
    name: 'sa.widget.index',
    component: Type
  },
  {
    path: '/widget/type/:type_id',
    name: 'sa.widget.type.actives',
    component: ActiveAssistants
  },
  {
    path: '/widget/type/:type_id/assistant/:assistant_id',
    name: 'sa.widget.type.assistant.show',
    component: Assistant
  },
  {
    path: '/widget/assistant/:type_id/total',
    name: 'sa.widget.type.total',
    component: Total
  }
]

export default widget_routes