import ToastAlert from "../../components/Alert";

const showToast = (toast, type, msg, onCompleteCallBack = () => {}) => {
  const handleOnComplete = () => {
    toast.closeAll();
    onCompleteCallBack();
  };
  toast.show({
    duration: 3000,
    onCloseComplete: onCompleteCallBack,
    render: ({}) => {
      return (
        <ToastAlert
          toast={toast}
          type={type || "warning"}
          msg={msg || "Null"}
          onComplete={handleOnComplete}
        />
      );
    },
  });
};

export default showToast;
