import axios from 'axios'
import {
    SET_ZONES_LIST,
    DELETE_ZONE,
    SET_CITIES,
    UPDATE_ZONE,
    SET_TYPES_LIST,
    DELETE_TYPE,
    UPDATE_TYPE,
    SET_ASSISTANT_LIST,
    SET_QUESTION_LIST,
    SET_BUTTONS_LIST,
    SET_INFOBLOCKS_LIST,
} from './mutation-types'

const actions = {
    fetchZones ({commit}) {
        return axios.get(route('sa.settings.zone.index'))
            .then((response) => {
                console.log(response.data)

                response.data.forEach(zone => {
                    let cities = []
                    zone.cities.forEach(city => {
                        cities.push(city.city.name_ru)
                    })
                    zone.cities = cities
                })

                window.zones = response.data
                commit(SET_ZONES_LIST, response.data)
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    removeZone ({commit}, zone) {
        return axios.delete(route('sa.settings.zone.destroy', zone.id))
            .then((response) => {
                commit(DELETE_ZONE, zone)
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    fetchCities ({commit}) {
        return axios.get(route('sa.settings.cities'))
            .then((response) => {
                commit(SET_CITIES, response.data)
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    updateZone ({commit, state}, zone) {
        let cities = {}
        state.cities.forEach(city => {
            if (zone.cities.indexOf(city.name_ru) !== -1) {
                cities[city.id] = city.name_ru
            }
        })
        return axios.put(route('sa.settings.zone.update', zone.id), {name: zone.name, cities: cities})
            .then((response) => {
                commit(UPDATE_ZONE, zone)
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    storeZone ({commit, state}, zone) {
        let cities = {}
        state.cities.forEach(city => {
            if (zone.cities.indexOf(city.name_ru) !== -1) {
                cities[city.id] = city.name_ru
            }
        })
        return axios.post(route('sa.settings.zone.store'), {name: zone.name, cities: cities})
            .then((response) => {
                commit(UPDATE_ZONE, zone)
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    fetchTypes ({commit}) {
        return axios.get(route('sa.settings.type.index'))
            .then((response) => {
                window.zones = response.data
                commit(SET_TYPES_LIST, response.data)
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    removeType ({commit}, type) {
        return axios.delete(route('sa.settings.type.destroy', type.id))
            .then(() => {
                commit(DELETE_TYPE, type)
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    storeType ({commit}, type) {
        const name = type.name
        return axios.post(route('sa.settings.type.store'), {name})
            .catch(function (error) {
                console.log(error)
            })
    },
    updateType ({commit}, type) {
        const name = type.name
        return axios.put(route('sa.settings.type.update', type.id), {name})
            .then(() => {
                commit(UPDATE_TYPE, type)
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    fetchAssistants ({commit}, type) {
        return axios.get(route('sa.settings.type.assistant.index', type.id))
            .then((response) => {
                response.data.forEach(assistant => assistant._rowVariant = assistant.status === 'active'
                ? 'success' :  assistant.status === 'old' ? 'warning' : '')
                commit(SET_ASSISTANT_LIST, response.data)
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    storeAssistant ({commit, getters}, {type, zone_id}) {
        return axios.post(route('sa.settings.type.assistant.store', type.id), {zone_id})
            .catch(function (error) {
                console.log(error)
            })
    },
    updateAssistant ({commit}, {type, assistant}) {
        console.log(type)
        console.log(assistant)
        return axios.put(route('sa.settings.type.assistant.update',
            {type: type.id, assistant: assistant.id}), {zone_id: assistant.zone.id})
            .catch(function (error) {
                console.log(error)
            })
    },
    removeAssistant ({commit}, {type, assistant}) {
        return axios.delete(route('sa.settings.type.assistant.destroy', {type: type.id, assistant: assistant.id}))
            .catch(function (error) {
                console.log(error)
            })
    },
    activateAssistant ({commit}, {type, assistant}) {
        return axios.patch(route('sa.settings.type.assistant.activate', {type: type.id, assistant: assistant.id}))
            .catch(function (error) {
                console.log(error)
            })
    },
    duplicateAssistant ({commit}, {type, assistant}) {
        return axios.patch(route('sa.settings.type.assistant.duplicate', {type: type.id, assistant: assistant.id}))
            .catch(function (error) {
                console.log(error)
            })
    },
    archiveAssistant ({commit}, {type, assistant}) {
        return axios.patch(route('sa.settings.type.assistant.archive', {type: type.id, assistant: assistant.id}))
            .catch(function (error) {
                console.log(error)
            })
    },
    fetchQuestions ({commit}, {type, assistant}) {
        return axios.get(route('sa.settings.type.assistant.question.index', {type: type.id, assistant: assistant.id}))
            .then((response) => {
                commit(SET_QUESTION_LIST, response.data)
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    storeQuestion ({commit}, {type, assistant, question}) {
        return axios.post(route('sa.settings.type.assistant.question.store',
            {type: type.id, assistant: assistant.id}), {question})
            .catch(function (error) {
                console.log(error)
            })
    },
    removeQuestion ({commit}, {type, assistant, question}) {
        return axios.delete(route('sa.settings.type.assistant.question.destroy',
            {type: type.id, assistant: assistant.id, question: question.id}))
            .catch(function (error) {
                console.log(error)
            })
    },
    updateQuestion ({commit}, {type, assistant, question}) {
        return axios.put(route('sa.settings.type.assistant.question.update',
            {type: type.id, assistant: assistant.id, question: question.id}), {value: question.question})
            .catch(function (error) {
                console.log(error)
            })
    },
    fetchButtons ({commit}, {type, assistant, question}) {
        return axios.get(route('sa.settings.type.assistant.question.button.index',
            {type: type.id, assistant: assistant.id, question: question.id}))
            .then((response) => {
                commit(SET_BUTTONS_LIST, response.data)
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    storeButton ({commit}, {type, assistant, question, button}) {
        return axios.post(route('sa.settings.type.assistant.question.button.store',
            {type: type.id, assistant: assistant.id, question: question.id}), {...button})
            .catch(function (error) {
                console.log(error)
            })
    },
    removeButton ({commit}, {type, assistant, question, button}) {
        return axios.delete(route('sa.settings.type.assistant.question.button.destroy',
            {type: type.id, assistant: assistant.id, question: question.id, button: button.id}))
            .catch(function (error) {
                console.log(error)
            })
    },
    storeButtonOrder ({commit}, {type, assistant, question, buttons}) {
        return axios.post(route('sa.settings.type.assistant.question.button.sort',
            {type: type.id, assistant: assistant.id, question: question.id}), {buttons})
            .catch(function (error) {
                console.log(error)
            })
    },
    updateButton ({commit}, {type, assistant, question, button}) {
        return axios.put(route('sa.settings.type.assistant.question.button.update',
            {type: type.id, assistant: assistant.id, question: question.id, button: button.id}), {...button})
            .catch(function (error) {
                console.log(error)
            })
    },
    fetchInfoblocks ({commit}, {type, assistant, question}) {
        return axios.get(route('sa.settings.type.assistant.question.infoblock.index',
            {type: type.id, assistant: assistant.id, question: question.id}))
            .then((response) => {
                commit(SET_INFOBLOCKS_LIST, response.data)
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    removeInfoblock ({commit}, {type, assistant, question, infoblock}) {
        return axios.delete(route('sa.settings.type.assistant.question.infoblock.destroy',
            {type: type.id, assistant: assistant.id, question: question.id, infoblock: infoblock.id}))
            .catch(function (error) {
                console.log(error)
            })
    },
    storeInfoblock ({commit}, {type, assistant, question, infoblock}) {
        return axios.post(route('sa.settings.type.assistant.question.infoblock.store',
            {type: type.id, assistant: assistant.id, question: question.id}), {...infoblock})
            .catch(function (error) {
                console.log(error)
            })
    },
    updateInfoblock ({commit}, {type, assistant, question, infoblock}) {
        return axios.put(route('sa.settings.type.assistant.question.infoblock.update',
            {type: type.id, assistant: assistant.id, question: question.id, infoblock: infoblock.id}), {...infoblock})
            .catch(function (error) {
                console.log(error)
            })
    },
}

export default actions