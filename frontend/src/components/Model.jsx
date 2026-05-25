function Modal({
  title,

  message,

  onConfirm,

  onCancel,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-[400px]">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
