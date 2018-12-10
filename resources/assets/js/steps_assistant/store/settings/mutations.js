import {
    DATA_LOADED,
    DATA_LOADING,
    SET_ZONES_LIST,
    DELETE_ZONE,
    SET_CITIES,
    UPDATE_ZONE,
    SET_TYPES_LIST,
    DELETE_TYPE,
    UPDATE_TYPE,
    SET_CURRENT_TYPE_ID,
    SET_ASSISTANT_LIST,
    SET_CURRENT_ASSISTANT_ID,
    SET_QUESTION_LIST,
    SET_BUTTONS_LIST,
    SET_CURRENT_QUESTION_ID,
    UPDATE_BUTTONS_ORDER,
    SET_INFOBLOCKS_LIST,
    SET_ACTIVE_TYPES_LIST,
} from './mutation-types'

const mutations = {

    [DATA_LOADED] (state) {
        state.loaded = true
    },
    [DATA_LOADING] (state) {
        state.loaded = false
    },
    [SET_ZONES_LIST] (state, zones) {
        state.zones = zones
    },
    [DELETE_ZONE] (state, zone) {
        state.zones = state.zones.filter(zoneFilter => {
            return zoneFilter.id !== zone.id
        })
    },
    [SET_CITIES] (state, cities) {
        state.cities = cities
    },
    [UPDATE_ZONE] (state, zone) {
        state.zones.forEach(zoneEach => {
            if (zoneEach.id === zone.id) {
                zoneEach.name = zone.name
                zoneEach.cities = zone.cities
            }
        })
    },
    [SET_TYPES_LIST] (state, types) {
        state.types = types
    },
    [DELETE_TYPE] (state, type) {
        state.types = state.types.filter(typeFilter => {
            return typeFilter.id !== type.id
        })
    },
    [UPDATE_TYPE] (state, type) {
        state.types.forEach(typeEach => {
            if (typeEach.id === type.id) {
                typeEach.name = type.name
            }
        })
    },
    [SET_CURRENT_TYPE_ID] (state, type_id) {
        state.current_type_id = type_id
    },
    [SET_ASSISTANT_LIST] (state, assistants) {
        state.assistants = assistants
    },
    [SET_CURRENT_ASSISTANT_ID] (state, assistant_id) {
        state.current_assistant_id = assistant_id
    },
    [SET_QUESTION_LIST] (state, questions) {
        state.questions = questions
    },
    [SET_BUTTONS_LIST] (state, buttons) {
        state.buttons = buttons
    },
    [SET_CURRENT_QUESTION_ID] (state, question_id) {
        state.current_question_id = question_id
    },
    [UPDATE_BUTTONS_ORDER] (state, buttons) {
        state.buttons = buttons
    },
    [SET_INFOBLOCKS_LIST] (state, infoblocks) {
        state.infoblocks = infoblocks
    },
    [SET_ACTIVE_TYPES_LIST] (state, active_types) {
        state.active_types = active_types
    },
}

export default mutations