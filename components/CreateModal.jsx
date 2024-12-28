import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const CreateModal = ({ setOpenCreateModal }) => {
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    status: "",
    priority: "",
    archived: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      status:
        formData.status.charAt(0).toUpperCase() +
        formData.status.slice(1).toLowerCase(),
      priority:
        formData.priority.charAt(0).toUpperCase() +
        formData.priority.slice(1).toLowerCase(),
    };

    console.log("Payload:", formattedData);
    try {
      const response = await axios.post(
        "https://nextjs-table-backend.onrender.com/api/create/",
        formattedData,
      );
      if (response.status === 201) {
        alert("Data Created Successfully");
        setOpenCreateModal(false);
      }
    } catch (error) {
      console.error("Error response:", error.response?.data);
      alert(
        `Error: ${error.response?.data?.message || "Something went wrong"}`,
      );
    }
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

  const onClose = () => {
    setOpenCreateModal(false);
  };

  return (
    <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle" open>
      <div className="modal-box">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Create New Data</h3>
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Code</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              className="input input-bordered w-full"
              required
            />
          </div>

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
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default CreateModal;
