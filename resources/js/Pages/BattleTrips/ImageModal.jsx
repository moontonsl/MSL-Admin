import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import battleTripsImage from "./Assets/Battle Trips_Page 4 (1).png";

export default function ImageModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-center">
      {/* Thumbnail Image */}
      <img
        src={battleTripsImage}
        alt="Second Image Description"
        className="w-[200px] h-auto md:w-[300px] mx-auto mb-6 object-contain cursor-pointer rounded-2xl"
        onClick={() => setIsOpen(true)}
      />

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.img
              src={battleTripsImage}
              alt="Popup Image"
              className="max-w-[90%] max-h-[90%] rounded-2xl shadow-lg"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}