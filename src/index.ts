import { FirebaseError } from "@firebase/util"
import useAlert from "@the-chat/alert"
import { SetState } from "@the-chat/types"
import { useTranslation } from "next-i18next"
import { SnackbarKey, SnackbarMessage } from "notistack"
import { useState } from "react"

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
  setWaiting?: SetWaiting
) => UseLogsReturn

// learn: factory?
// todo?: too much things to do in one hook?
/** uses "fallbacks" namespace
 *  and 2 keys: "loading" key and "error" key with "errorMessage" var */
const useLogs: UseLogs = (setWaiting) => {
  const { t } = useTranslation("fallbacks")
  const { closeSnackbar, enqueueSnackbar } = useAlert()

  let key: SnackbarKey | undefined

  const loading: Loading = () => {
    setWaiting && setWaiting(true)

    key = enqueueSnackbar(t("loading"), {
      variant: "info",
      persist: true,
    })
  }

  // .then
  const handleSuccess: HandleSuccess = (message) => () => {
    setWaiting && setWaiting(false)

    closeSnackbar(key)
    enqueueSnackbar(message, { variant: "success" })
  }

  // .catch
  // now mostly for firebase
  const handleError: HandleError = (customMessage) => (error) => {
    setWaiting && setWaiting(false)

    // todo long time: send error with user data to server
    console.dir(error)
    closeSnackbar(key)
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

export const useStateLogs = (): [UseLogsReturn, boolean] => {
  const [waiting, setWaiting] = useState(false)

  return [useLogs(setWaiting), waiting]
}

export default useLogs
