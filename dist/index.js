"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@firebase/util");
var alert_1 = __importDefault(require("@the-chat/alert"));
// learn: factory?
var useLogs = function (setWaiting, loadingMessage, handleErrorMessage) {
    var _a = alert_1.default(), closeSnackbar = _a.closeSnackbar, enqueueSnackbar = _a.enqueueSnackbar;
    var key = null;
    var loading = function () {
        setWaiting(true);
        key = enqueueSnackbar(loadingMessage, {
            variant: "info",
            persist: true,
        });
    };
    // .then
    var handleSuccess = function (message) { return function () {
        setWaiting(false);
        closeSnackbar(key);
        enqueueSnackbar(message, { variant: "success" });
    }; };
    // .catch
    // now mostly for firebase
    var handleError = function (customMessage) { return function (error) {
        // todo long time: send error with user data to server
        console.dir(error);
        closeSnackbar(key);
        setWaiting(false);
        enqueueSnackbar(
        // kinda hacky, maybe there is better solution
        // todo: error.code not translatable
        // test
        handleErrorMessage(customMessage ||
            (error instanceof util_1.FirebaseError ? error.code : error === null || error === void 0 ? void 0 : error.message)), { variant: "error" });
    }; };
    return {
        loading: loading,
        handleSuccess: handleSuccess,
        handleError: handleError,
    };
};
exports.default = useLogs;
