import { FirebaseError } from "@firebase/util"
import useAlert from "@the-chat/alert"
import { SetState } from "@the-chat/types"
import { useTranslation } from "next-i18next"
import { SnackbarKey, SnackbarMessage } from "notistack"

export type HandleSuccess = (message: SnackbarMessage) => () => void
export type HandleError = (
  customMessage?: string
) => (error?: FirebaseError | Error) => void
export type Loading = () => void

export type UseLogsReturn = {
  loading: Loading
  handleSuccess: HandleSuccess
  handleError: HandleError
}

export type SetWaiting = SetState<boolean>

export type UseLogs = (
  /** setState most of the time */
  setWaiting: SetWaiting
) => UseLogsReturn

// learn: factory?
/** uses "fallbacks" namespace
 *  and 2 keys: "loading" key and "error" key with "errorMessage" var */
const useLogs: UseLogs = (setWaiting) => {
  const { t } = useTranslation("fallbacks")
  const { closeSnackbar, enqueueSnackbar } = useAlert()

  let key: SnackbarKey | undefined

  const loading: Loading = () => {
    setWaiting(true)

    key = enqueueSnackbar(t("loading"), {
      variant: "info",
      persist: true,
    })
  }

  // .then
  const handleSuccess: HandleSuccess = (message) => () => {
    setWaiting(false)
    closeSnackbar(key)
    enqueueSnackbar(message, { variant: "success" })
  }

  // .catch
  // now mostly for firebase
  const handleError: HandleError = (customMessage) => (error) => {
    // todo long time: send error with user data to server
    console.dir(error)
    closeSnackbar(key)
    setWaiting(false)
    enqueueSnackbar(
      // kinda hacky, maybe there is better solution
      // todo: error.code not translatable
      // test
      t("error", {
        errorMessage:
          customMessage ||
          (error instanceof FirebaseError ? error.code : error?.message),
      }),
      { variant: "error" }
    )
  }

  return {
    loading,
    handleSuccess,
    handleError,
  }
}

export default useLogs
