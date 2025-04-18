// src/utils/useSweetAlert.js
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const useSweetAlert = () => {
  const success = (title = 'تمت العملية بنجاح', callback = null) => {
    MySwal.fire({
      icon: 'success',
      title,
      confirmButtonText: 'موافق',
      customClass: {
        popup: 'text-right'
      }
    }).then(() => {
      if (callback) callback();
    });
  };

  const error = (title = 'حدث خطأ', text = 'يرجى المحاولة لاحقًا') => {
    MySwal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'موافق',
      customClass: {
        popup: 'text-right'
      }
    });
  };

  const confirm = ({
    title = 'هل أنت متأكد؟',
    text = 'لن تتمكن من التراجع عن هذا الإجراء!',
    confirmText = 'نعم، احذف',
    cancelText = 'إلغاء',
    onConfirm = () => {}
  }) => {
    MySwal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
      customClass: {
        popup: 'text-right'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  };

  return { success, error, confirm };
};

export default useSweetAlert;
