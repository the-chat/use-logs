import { FirebaseError } from "@firebase/util";
import { SetState } from "@the-chat/types";
import { SnackbarMessage } from "notistack";
export declare type HandleSuccess = (message: string) => () => void;
export declare type HandleError = (customMessage?: string) => (error?: FirebaseError | Error) => void;
export declare type Loading = () => void;
export declare type UseLogsReturn = {
    loading: Loading;
    handleSuccess: HandleSuccess;
    handleError: HandleError;
};
export declare type SetWaiting = SetState<boolean>;
export declare type UseLogs = (setWaiting: SetWaiting, loadingMessage: SnackbarMessage, handleErrorMessage: (errorMessage: string) => SnackbarMessage) => UseLogsReturn;
declare const useLogs: UseLogs;
export default useLogs;
