import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  note: ''
}

const mutations = {
  CREATE_NOTE(state, data) {
    console.log(data)
    state.note = data
  }
}

const actions = {
  createNote({commit}, data) {
    notes.store(data).subscribe((msg) => {
        data.id = msg.id
        commit('CREATE_NOTE', data)
      }
    )
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

export default store
