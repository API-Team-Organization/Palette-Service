import './scss/UtilBox.scss';
import { IoPencil, IoTrashOutline } from "react-icons/io5";
import { FC, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface UtilBoxProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  roomId: number;
}

const UtilBox: FC<UtilBoxProps> = ({ visible, setVisible, roomId }) => {
  const utilBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (utilBoxRef.current && !utilBoxRef.current.contains(event.target as Node)) {
        setVisible(false); // Close UtilBox if clicked outside
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, setVisible]);

  const renameRoom = async () => {
    try {
      const newRoomName = prompt('새로운 방 이름을 입력하세요.');

      if (!newRoomName) return;

      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/room/${roomId}/title`, {
        title: newRoomName
      }, {
        headers: {
          'x-auth-token': Cookies.get('token')
        }
      }).then((res) => {
        if (res.status === 200) {
          location.reload();
        }
      })
    } catch (err) {
      throw new Error(`방 이름 변경 중 오류 발생: ${err}`);
    }
  }

  const deleteRoom = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/room/${roomId}`,{
        headers: {
          'x-auth-token': Cookies.get('token')
        }
      }).then((res) => {
        if (res.status === 200) {
          location.href = `/chat/${roomId}`;
        }
      })
    } catch (err) {
      throw new Error(`방 이름 변경 중 오류 발생: ${err}`);
    }
  }

  return (
      <div
          ref={utilBoxRef}
          className={`util-container`}
          style={{ display: visible ? 'flex' : 'none' }}
      >
        <div className={`center`}>
          <div className={`util`} onClick={() => renameRoom()}>
            <IoPencil size={18} />
            <p>이름 바꾸기</p>
          </div>
          <div className={`util`} onClick={() => deleteRoom()}>
            <IoTrashOutline size={18} />
            <p>삭제하기</p>
          </div>
        </div>
      </div>
  );
};

export default UtilBox;
