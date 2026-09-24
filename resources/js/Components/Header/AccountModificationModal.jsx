import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { router } from "@inertiajs/react"; // ✅ import Inertia router

const AccountModificationModal = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState("");
    const [modificationType, setModificationType] = useState("");
    const [wrongFirstName, setWrongFirstName] = useState("");
    const [wrongLastName, setWrongLastName] = useState("");
    const [correctFirstName, setCorrectFirstName] = useState("");
    const [correctLastName, setCorrectLastName] = useState("");
    const [wrongValue, setWrongValue] = useState("");
    const [correctValue, setCorrectValue] = useState("");

    if (!isOpen) return null;

    const resetForm = () => {
        setUsername("");
        setModificationType("");
        setWrongFirstName("");
        setWrongLastName("");
        setCorrectFirstName("");
        setCorrectLastName("");
        setWrongValue("");
        setCorrectValue("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // log the form data
        console.log({
            username,
            modificationType,
            wrongFirstName,
            wrongLastName,
            correctFirstName,
            correctLastName,
            wrongValue,
            correctValue,
        });

        // ✅ Open the waiting page in a new tab
        window.open("/AccountModificationWaiting", "_blank");

        resetForm();
        onClose();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
            resetForm();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-[rgba(10,10,10,0.5)] rounded-lg p-6 max-w-lg mx-4 border border-[#242424] shadow-lg backdrop-blur-[10px]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[rgba(10,10,10,0.8)] rounded-full flex items-center justify-center mr-3 border border-[#facc15]">
                        <AlertTriangle className="w-6 h-6 text-[#facc15]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                        MSL Account Modification Request Form
                    </h3>
                </div>
                <p className="text-gray-300 mb-4 text-sm">
                    Make sure that the username is correct for you to receive an email after action is made on the modification request.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                    {/* Username */}
                    <div>
                        <label className="block text-gray-300 mb-1">
                            MSL Account Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                            placeholder="Enter your MSL username"
                            required
                        />
                    </div>

                    {/* Modification Type */}
                    <div>
                        <label className="block text-gray-300 mb-1">
                            What modifications do you want to apply?
                        </label>
                        <select
                            value={modificationType}
                            required
                            onChange={(e) => {
                                setModificationType(e.target.value);
                                setWrongFirstName("");
                                setWrongLastName("");
                                setCorrectFirstName("");
                                setCorrectLastName("");
                                setWrongValue("");
                                setCorrectValue("");
                            }}
                            className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                        >
                            <option value="" disabled>Select</option>
                            <option value="Full Name">Full Name</option>
                            <option value="School">School</option>
                            <option value="Course">Course</option>
                            <option value="Student ID">Student ID</option>
                        </select>
                    </div>

                    {/* Full Name Fields */}
                    {modificationType === "Full Name" && (
                        <>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-gray-300 mb-1">
                                        Wrong First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={wrongFirstName}
                                        onChange={(e) => setWrongFirstName(e.target.value)}
                                        className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                        placeholder="Enter wrong first name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-1">
                                        Wrong Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={wrongLastName}
                                        onChange={(e) => setWrongLastName(e.target.value)}
                                        className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                        placeholder="Enter wrong last name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-gray-300 mb-1">
                                        Correct First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={correctFirstName}
                                        onChange={(e) => setCorrectFirstName(e.target.value)}
                                        className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                        placeholder="Enter correct first name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-1">
                                        Correct Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={correctLastName}
                                        onChange={(e) => setCorrectLastName(e.target.value)}
                                        className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                        placeholder="Enter correct last name"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* School Fields */}
                    {modificationType === "School" && (
                        <>
                            <div>
                                <label className="block text-gray-300 mb-1">
                                    Wrong School
                                </label>
                                <select
                                    value={wrongValue}
                                    required
                                    onChange={(e) => setWrongValue(e.target.value)}
                                    className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                >
                                    <option>Dummy School A</option>
                                    <option>Dummy School B</option>
                                    <option>Dummy School C</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">
                                    Correct School
                                </label>
                                <select
                                    value={correctValue}
                                    required
                                    onChange={(e) => setCorrectValue(e.target.value)}
                                    className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                >
                                    <option>Dummy School A</option>
                                    <option>Dummy School B</option>
                                    <option>Dummy School C</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* Course Fields */}
                    {modificationType === "Course" && (
                        <>
                            <div>
                                <label className="block text-gray-300 mb-1">
                                    Wrong Course
                                </label>
                                <input
                                    type="text"
                                    value={wrongValue}
                                    onChange={(e) => setWrongValue(e.target.value)}
                                    className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                    placeholder="Enter wrong course"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">
                                    Correct Course
                                </label>
                                <input
                                    type="text"
                                    value={correctValue}
                                    onChange={(e) => setCorrectValue(e.target.value)}
                                    className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                    placeholder="Enter correct course"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* Student ID Fields */}
                    {modificationType === "Student ID" && (
                        <>
                            <div>
                                <label className="block text-gray-300 mb-1">
                                    Wrong Student ID
                                </label>
                                <input
                                    type="text"
                                    value={wrongValue}
                                    onChange={(e) => setWrongValue(e.target.value)}
                                    className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                    placeholder="Enter wrong student ID"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">
                                    Correct Student ID
                                </label>
                                <input
                                    type="text"
                                    value={correctValue}
                                    onChange={(e) => setCorrectValue(e.target.value)}
                                    className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                    placeholder="Enter correct student ID"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                onClose();
                            }}
                            className="px-4 py-2 text-gray-300 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md hover:bg-[rgba(20,20,20,0.8)] hover:border-[#facc15] transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-black bg-[#facc15] rounded-md hover:bg-[#e0b90f] transition-all duration-200 border border-[#facc15] hover:shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                        >
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountModificationModal;