import { combineReducers } from "redux";

import { authentication } from "./authenticationReducer";
import { registration } from "./registrationReducer";
import { user } from "./userReducer";
import { alert } from "./alertReducer";
import { post } from "./postReducer";
import { userProfile } from "./userProfileReducer";
import { postUpload } from "./postUploadPageReducer";
import { newUsers } from "./newUsersReducer";
import { passwordReset } from "./passwordResetReducer";
import { userConstants } from "../_constants/userConstants";

// TODO:

const appReducer = combineReducers({
    post,
    authentication,
    registration,
    user,
    newUsers,
    passwordReset,
    alert,
    userProfile,
    postUpload,
});

const rootReducer = (state, action) => {
    if (action.type === userConstants.LOGOUT) {
        state = undefined;
    }

    return appReducer(state, action);
};

export default rootReducer;
