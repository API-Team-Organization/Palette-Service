import './scss/StateToast.scss'
import { IoClose } from "react-icons/io5";
import { GiCampingTent } from "react-icons/gi";
import {FC} from "react";

export enum ToastProps {
  GENERATE = "GENERATE",
  QUEUE = "QUEUE"
}

interface StateToastProps {
  type: ToastProps
  title?: string
}

const StateToast: FC<StateToastProps> = ({ title, type }) => {
  return (
      <div className={`toast-container`}>
        <IoClose />
        <div>
          <GiCampingTent />
          <h2>{type === ToastProps.GENERATE ? "생성중..." : title}</h2>
        </div>
      </div>
  )
}

export default StateToast;
