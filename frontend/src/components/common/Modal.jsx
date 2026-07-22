function Modal({
  title,

  message,

  onConfirm,

  onCancel,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 transition-all">
      <div className="bg-white rounded-xl shadow-xl ring-1 ring-black/5 p-6 w-[400px] transform transition-all">
        <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>

        <p className="text-sm text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
