"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorHandler(err, req, res, next) {
    let code;
    let name = err.name;
    let message;
    switch (name) {
        case "missing_token":
            code = 401;
            message = "Missing Token: Please re-Login";
            break;
        case "incorrect_token":
            code = 401;
            message = "Incorrect Token: Please re-Login";
            break;
        case "invalid_token":
            code = 401;
            message = "Invalid Token: Please re-Login";
            break;
        case "not_verified":
            code = 401;
            message = "Incorrect Password or Email!";
            break;
        case "twostep_auth":
            code = 401;
            message = "Incorrect Password!";
            break;
        case "unauthorized":
            code = 403;
            message = "Forbidden Access!";
            break;
        case "not_found":
            code = 404;
            message = "Requested result not found!";
            break;
        case "unique_email":
            code = 422;
            message = "This email is already taken! use another!";
            break;
        case "unique_phone":
            code = 422;
            message = "This phone number is already taken! use another!";
            break;
        case "invalid_email":
            code = 422;
            message = "Invalid: Please input a valid email!";
            break;
        default:
            code = 500;
            message = "Internal Server Error";
    }
    res.status(code).json({ success: false, message });
}
exports.default = errorHandler;
