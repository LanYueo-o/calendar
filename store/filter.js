const state = ({
    value: '',
});
const getters = {
    include: (state) => (val) => {
        return state.value.indexOf(val) > -1;
    }
};
const mutations = {
    SET_VALUE(state, value) {
        console.info(value);
        state.value = value;
    }
};
const actions = {
    async getInfo({state, commit}, val) {
        commit('SET_VALUE', val);
        sessionStorage.setItem('SET_TITLE',val);
        console.info(val);
    }
};

export default {
    namespace:true,
    state,
    getters,
    actions,
    mutations
};
