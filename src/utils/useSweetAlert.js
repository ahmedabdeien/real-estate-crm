// ✅ SweetAlert شامل: confirm + success + error + toastSuccess/toastError
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// أنماط الأزرار
const buttonStyles = {
  success: 'bg-blue-600 hover:bg-blue-700',
  danger: 'bg-red-600 hover:bg-red-700',
  info: 'bg-gray-500 hover:bg-gray-600',
};

const getClass = (type = 'success') => ({
  popup: 'text-right dark:bg-gray-800 dark:text-white',
  confirmButton: `${buttonStyles[type] || buttonStyles.success} text-white px-4 py-2 rounded focus:outline-none`,
  cancelButton: 'bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 ml-2 focus:outline-none',
});

// ✅ إشعار سريع Toast
const Toast = Swal.mixin({
  toast: true,
  position: 'top', // ✅ منتصف الشاشة
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: 'text-sm text-center bg-white dark:bg-gray-800 dark:text-white shadow-lg rounded-md px-4 py-2'
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const useSweetAlert = () => {
  const toastSuccess = (title = 'تم بنجاح') => {
    Toast.fire({ icon: 'success', title });
  };

  const toastError = (title = 'حدث خطأ') => {
    Toast.fire({ icon: 'error', title });
  };

  const success = (title = 'تمت العملية بنجاح', callback = null) => {
    MySwal.fire({
      icon: 'success',
      title,
      confirmButtonText: 'موافق',
      customClass: getClass('success'),
      buttonsStyling: false
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
      customClass: getClass('info'),
      buttonsStyling: false
    });
  };

  const confirm = ({
    title = 'هل أنت متأكد؟',
    text = 'لن تتمكن من التراجع عن هذا الإجراء!',
    confirmText = 'نعم، احذف',
    cancelText = 'إلغاء',
    onConfirm = () => {},
    type = 'danger',
  }) => {
    MySwal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
      customClass: getClass(type),
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  };

  return { success, error, confirm, toastSuccess, toastError };
};

export default useSweetAlert;
