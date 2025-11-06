"use client";
import { SetStateAction, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { Modal, ModalBody } from "@/components/ui/modal";
import { toast } from "sonner";

export default function AddressForm() {
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      type: "Billing Address",
      name: "Sofia Havertz",
      phone: "(+1) 234 567 890",
      address: "345 Long Island, NewYork, United States",
    },
    {
      type: "Shipping Address",
      name: "Sofia Havertz",
      phone: "(+1) 234 567 890",
      address: "345 Long Island, NewYork, United States",
    },
    {
      type: "Billing Address",
      name: "Sofia Havertz",
      phone: "(+1) 234 567 890",
      address: "300 Long Island, NewYork, United States",
    },
    {
      type: "Shipping Address",
      name: "Sofia Havertz",
      phone: "(+1) 234 567 890",
      address: "345 Long Island, NewYork, United States",
    },
  ]);

  const [formData, setFormData] = useState({
    type: "",
    name: "",
    phone: "",
    address: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const handleEdit = (index: number) => {
    const addressToEdit = addresses[index];
    setFormData(addressToEdit);
    setEditingIndex(index);
    setOpen(true);
  };

  const handleSaveAddress = () => {
    if (
      !formData.type ||
      !formData.name ||
      !formData.phone ||
      !formData.address
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    if (editingIndex !== null) {
      const updatedAddresses = [...addresses];
      updatedAddresses[editingIndex] = formData;
      setAddresses(updatedAddresses);
      toast.success("Address updated successfully");
    } else {
      setAddresses([...addresses, formData]);
      toast.success("Address added successfully");
    }
    setFormData({ type: "", name: "", phone: "", address: "" });
    setEditingIndex(null);
    setOpen(false);
  };

  const handleDelete = () => {
    // Implement delete functionality if needed
    }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-6">
        <img
          src="https://res.cloudinary.com/do0im8hgv/image/upload/v1757949103/image_3_f2tien.png"
          alt=""
          className="w-[43px] h-[43px] mr-3"
        />
        <h2 className="text-xl font-semibold text-[25px]">Account Details</h2>
        <button
          onClick={() => {
            setFormData({ type: "", name: "", phone: "", address: "" });
            setEditingIndex(null);
            setOpen(true);
          }}
          className="ml-auto text-black hover:text-[#29c9d7] transition-colors duration-300"
        >
          <IoAddCircleOutline className="w-[35px] h-[35px]" />
        </button>
      </div>

      {/* Address Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((item, index) => (
          <div
            key={index}
            className="relative border rounded-lg p-4 shadow-sm bg-white"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{item.type}</h3>
              <button
                onClick={() => handleEdit(index)}
                className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm"
              >
                <div className="flex items-center gap-1">
                  <CiEdit className="w-[16px] h-[16px]" />
                  <span className="text-[16px] font-semibold">Edit</span>
                </div>
              </button>
            </div>

            {/* Body */}
            <div className="text-[14px] text-gray-700 space-y-1 font-sans">
              <p>{item.name}</p>
              <p>{item.phone}</p>
              <p>{item.address}</p>
            </div>
          </div>
        ))}

        <button
          // onClick={handleDelete}
          className="relative inline-block px-6 py-2 font-semibold text-white bg-[#880000] rounded-md overflow-hidden group w-[180px] h-[42px]"
        >
          <span className="absolute inset-0 bg-[#EE0000] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
          <span className="relative z-10">Delete</span>
        </button>
      </div>

      {/* Popup Add/Edit */}
      {open && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          variant="centered"
          size="md"
          showOverlay
          showCloseButton={false}
        >
          <ModalBody>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {editingIndex !== null ? "Edit Address" : "Add New Address"}
              </h2>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address Type
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="">Select Address Type</option>
                    <option value="Billing Address">Billing Address</option>
                    <option value="Shipping Address">Shipping Address</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows={3}
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  ></textarea>
                </div>
              </form>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAddress}
                  className="relative inline-block px-6 py-2 font-semibold text-white bg-blue-600 rounded-md overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-[#29c9d7] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                  <span className="relative z-10">Save</span>
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}
