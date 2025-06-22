import React, { useEffect, useState } from "react";
import axios from "axios";
import HistoryProteinWidget from "./HistoryProteinWidget";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

import { ChevronRight } from "lucide-react";

const HistoryProteinDetails = ({ userId, date }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [detailsData, setDetailsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(detailsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = detailsData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [detailsData]);

  const fetchDetails = async () => {
    if (!userId || !date) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/tracker/history/${date.split("T")[0]}/${userId}`
      );
      setDetailsData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching details:", error);
      setDetailsData([]);
    }
    setLoading(false);
  };

  const handleOpen = () => {
    onOpen();
    fetchDetails();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Button isIconOnly className="bg-transparent" onPress={handleOpen}>
        <ChevronRight className="text-gray-400" />
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div>
                  <p className="text-lg font-semibold">
                    Detail Riwayat Konsumsi
                  </p>
                  <p className="text-sm font-normal text-gray-500">
                    {formatDate(date)}
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : detailsData.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {detailsData.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-row bg-white p-4 py-3 rounded-xl border border-gray-100 items-center gap-4 shadow-sm"
                      >
                        <div className="flex flex-col justify-center w-full">
                          <p className="text-base font-medium text-gray-600">
                            {item.namaMakanan}
                          </p>
                          <p className="text-sm font-normal text-gray-400">
                            {item.jumlahPorsi} Porsi
                          </p>
                        </div>
                        <p className="text-sm font-normal text-gray-500 text-right w-full">
                          Total Protein:{" "}
                          {parseFloat(item.totalProtein).toFixed(1)}g
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Tidak ada data konsumsi untuk tanggal ini
                  </div>
                )}

                {detailsData.length > 5 && (
                  <div className="flex w-full justify-end gap-1 ">
                    <Button
                      isIconOnly
                      isDisabled={currentPage === 1}
                      onPress={() => setCurrentPage(currentPage - 1)}
                      size="sm"
                      className="bg-primary-100"
                    >
                      <ChevronLeft className="w-4 h-4 text-primary-600" />
                    </Button>
                    <Button
                      isIconOnly
                      isDisabled={currentPage === totalPages}
                      onPress={() => setCurrentPage(currentPage + 1)}
                      size="sm"
                      className="bg-primary-100"
                    >
                      <ChevronRight className="w-4 h-4 text-primary-600" />
                    </Button>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={onClose}
                  className="w-full bg-primary-600"
                >
                  Kembali
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default HistoryProteinDetails;
