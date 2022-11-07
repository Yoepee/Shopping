import { configureStore, createSlice } from '@reduxjs/toolkit'

let cart = createSlice({
    name : 'cart',
    initialState : [
        {id : 0, name : 'White and Black', count : 2},
        {id : 2, name : 'Grey Yordan', count : 1}
      ] ,
      reducers:{
        changeCount(state, action){
            let i = action.payload;
            let index = state.findIndex(cart=> cart.id === i);
            state[index].count+=1
        },
        addItem(state, action){
            let index= state.findIndex(cart=> cart.id === action.payload.id);
            index === -1?
            state.push(action.payload)
            :state[index].count+=Number(action.payload.count)
        },
        removeItem(state, action){
          let index = state.findIndex(cart=> cart.id === action.payload);
          state.splice(index,1);
        }
      }
})

let user = createSlice({
    name : 'user',
    initialState : {name:"kim", age:20},
    reducers: {
        changeName(state){
            state.name='park'
        },
        changeAge(state){
            state.age+=1
        }
    }
})

export let {changeName, changeAge} = user.actions;
export let {changeCount, addItem, removeItem} = cart.actions;

export default configureStore({
  reducer: { 
    cart : cart.reducer,
    user : user.reducer
  }
}) 