export const reducer = (state, action) => {
  
    switch (action.type) {
      case "USER_LOGIN": {
        return { ...state, isLogin:true, user: action.payload}
      }
      case "USER_LOGOUT": {
        return { ...state, user: null, isLogin:false } 
      }
      case "CHANGE_THEME": {
        return { ...state, darkTheme: !state.darkTheme }
      }
      case "CHANGE_NAME":{
        return { ...state, name: action.payload}
      }
      case "SPLASH_SCREEN":{
        return { ...state, splashScreen:false}
      }
      default: {
       return state
      }
    }
  }