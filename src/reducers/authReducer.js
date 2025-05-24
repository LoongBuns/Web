export default function authReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload,
        loading: false,
      };
    case "LOGOUT":
      return { ...state, isAuthenticated: false, token: null, loading: false };

    case "REGISTER_SUCCESS":
      return { ...state, loading: false, error: null };

    case "SET_USER":
      return { ...state, user: action.payload };

    case "ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}
