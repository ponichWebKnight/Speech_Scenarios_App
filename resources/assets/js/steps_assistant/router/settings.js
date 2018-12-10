import Index from '../pages/settings/Index'
import Zone from '../pages/settings/Zone'
import Type from '../pages/settings/Type'
import Assistant from '../pages/settings/Assistant'
import Question from '../pages/settings/Question'
import Button from '../pages/settings/Button'
import Infoblock from '../pages/settings/Infoblock'
import PreviewAssistant from '../pages/settings/PreviewAssistant'
import Selector from '../pages/settings/Selector'

const settings_routes = [
    {
        path: '/settings',
        name: 'sa.settings.index',
        component: Index
    },
    {
        path: '/settings/zone',
        name: 'sa.settings.zone.index',
        component: Zone
    },
    {
        path: '/settings/type',
        name: 'sa.settings.type.index',
        component: Type
    },
    {
        path: '/settings/type/:type_id/assistant',
        name: 'sa.settings.type.assistant.index',
        component: Assistant
    },
    {
        path: '/settings/type/:type_id/assistant/:assistant_id/preview',
        name: 'sa.settings.type.assistant.preview',
        component: PreviewAssistant
    },
    {
        path: '/settings/type/:type_id/assistant/:assistant_id/question',
        name: 'sa.settings.type.assistant.question.index',
        component: Question
    },
    {
        path: '/settings/type/:type_id/assistant/:assistant_id/question/:question_id/button',
        name: 'sa.settings.type.assistant.question.button.index',
        component: Button
    },
    {
        path: '/settings/type/:type_id/assistant/:assistant_id/question/:question_id/infoblock',
        name: 'sa.settings.type.assistant.question.infoblock.index',
        component: Infoblock
    },
    {
        path: '/settings/type/:type_id/assistant/:assistant_id/question/:question_id/selector',
        name: 'sa.settings.type.assistant.question.selector.index',
        component: Selector
    }
]

export default settings_routes