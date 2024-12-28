// EditModal.js
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditModal = ({ isOpen, onClose, data, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    title: "",
    status: "",
    priority: "",
    archived: false,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || "",
        status: data.status || "",
        priority: data.priority || "",
        archived: data.archived || false,
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...data, ...formData });
  };

  const statusOptions = [
    { value: "todo", label: "Todo" },
    { value: "in-progress", label: "In Progress" },
    { value: "done", label: "Done" },
    { value: "canceled", label: "Canceled" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  if (!isOpen) return null;

  return (
    <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle" open>
      <div className="modal-box">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Edit Task #{data?.code}</h3>
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Priority</span>
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Priority</option>
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Archived</span>
              <input
                type="checkbox"
                checked={formData.archived}
                onChange={(e) =>
                  setFormData({ ...formData, archived: e.target.checked })
                }
                className="checkbox"
              />
            </label>
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={() => onDelete(data?.code)}
              className="btn btn-error"
            >
              Delete
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="btn">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default EditModal;
