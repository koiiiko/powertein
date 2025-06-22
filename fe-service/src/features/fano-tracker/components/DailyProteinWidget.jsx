import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
  Chip,
  Progress,
  Pagination,
  PaginationItem,
  PaginationCursor,
} from "@heroui/react";
import {
  Trash2,
  RefreshCw,
  Utensils,
  XCircle,
  X,
  MoreVertical,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const DailyProteinWidget = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [consumeData, setConsumeData] = useState([]);
  const [totalProtein, setTotalProtein] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [error, setError] = useState(null);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRefresh, setIsRefresh] = useState(false);
  const [userProtein, setUserProtein] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  const itemsPerPage = 3;
  const totalPages = Math.ceil(consumeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = consumeData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [consumeData]);

  useEffect(() => {
    const fetchProtein = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/calculator/protein/${userId}`
          );
          setUserProtein(response.data.protein);
        } catch (error) {
          console.error("Error fetching protein data:", error);
        }
      }
    };
    fetchProtein();
  }, [userId]);

  // Fetch today's consumption data
  const getTodayConsume = useCallback(
    async (refresh = false) => {
      if (!userId) return;

      try {
        if (!refresh) {
          setLoading(true);
        } else {
          setIsRefresh(true);
        }

        setErrorAlert(false);
        setErrorMessage("");

        const response = await fetch(
          `http://localhost:5000/tracker/today/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();
        const data = result.data || [];

        console.log("Fetched data:", data);

        setConsumeData(data);

        if (data.length > 0) {
          setTotalProtein(data[0].proteinHarian || 0);
        } else {
          setTotalProtein(0);
        }

        if (refresh) {
          setSuccessAlert(true);
          setTimeout(() => setSuccessAlert(false), 2000);
        }
      } catch (error) {
        const message = error.message || "Gagal mengambil data konsumsi";
        setErrorMessage(message);
        setErrorAlert(true);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setIsRefresh(false);
      }
    },
    [userId]
  );

  // Initial data load
  useEffect(() => {
    getTodayConsume(false);
  }, [getTodayConsume]);

  const deleteConsume = async () => {
    try {
      setDeleteLoading(true);

      const response = await fetch(
        `http://localhost:5000/tracker/delete/${deleteItemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      setShowDeleteModal(false);
      setDeleteItemId(null);

      await getTodayConsume(true);

      setSuccessAlert(true);
      setTimeout(() => setSuccessAlert(false), 2000);
    } catch (error) {
      console.error("Error deleting consumption:", error);
      setErrorMessage(error.message || "Gagal menghapus data");
      setErrorAlert(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteClick = (itemId) => {
    setDeleteItemId(itemId);
    setShowDeleteModal(true);
    setOpenPopoverId(null);
  };

  return (
    <div className="flex flex-col w-full bg-slate-50 p-6 shadow-sm border border-gray-100 rounded-xl gap-6">
      {errorAlert && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600" />
            <div>
              <span className="text-red-800 font-medium">
                Gagal memuat data konsumsi
              </span>
              {errorMessage && (
                <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setErrorAlert(false);
              setErrorMessage("");
            }}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-row mb-2">
        <p className="text-left font-medium text-lg text-gray-600 w-full items-center">
          Konsumsi protein hari ini
        </p>
        {isRefresh && (
          <RefreshCw className="w-2 h-2 text-blue-500 animate-spin" />
        )}
        {totalProtein < userProtein ? (
          <Chip size="sm" className="font-default bg-gray-200 text-gray-500">
            Belum memenuhi kebutuhan harian
          </Chip>
        ) : (
          <Chip
            size="sm"
            className="font-default bg-green-100 text-green-500"
            startContent={<Check size={14} />}
          >
            Memenuhi kebutuhan harian{" "}
          </Chip>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Progress
          className="w-full"
          classNames={{ indicator: "bg-primary-500" }}
          color="warning"
          maxValue={userProtein}
          size="sm"
          value={totalProtein.toFixed(1)}
        />
        <p className="text-right font-semibold text-xs text-gray-500 items-center">
          {totalProtein.toFixed(1)}/<span>{userProtein}gr</span>
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            Memuat data konsumsi...
          </h3>
          <p className="text-gray-400">Mohon tunggu sebentar</p>
        </div>
      ) : consumeData.length === 0 ? (
        <div className="text-center py-8">
          <Utensils className="w-6 h-6 text-gray-300 mx-auto mb-2" />
          <p className="text-base font-normal text-gray-400 mb-2">
            Belum ada data konsumsi protein hari ini
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentItems.map((item) => (
            <div
              key={item.id}
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
                Total Protein: {item.totalProtein.toFixed(1)}gr
              </p>
              <Popover
                placement="right"
                isOpen={openPopoverId === item.id}
                onOpenChange={(isOpen) =>
                  setOpenPopoverId(isOpen ? item.id : null)
                }
              >
                <PopoverTrigger>
                  <Button isIconOnly className="bg-transparent" size="sm">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-2">
                  <Button
                    onPress={() => {
                      handleDeleteClick(item.id);
                    }}
                    startContent={<Trash2 className="w-4 h-4" />}
                    size="sm"
                    variant="light"
                    color="danger"
                    className="font-medium"
                  >
                    Hapus Data
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
      )}
      {consumeData.length > 3 && (
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
      <Modal
        isOpen={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        classNames={{
          backdrop: "bg-gray-900/70",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-md font-medium text-gray-800">
                Menghapus data
              </ModalHeader>
              <ModalBody className="text-base font-medium text-gray-600">
                Apakah Anda yakin untuk menghapus? Tindakan ini tidak dapat
                dibatalkan.
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Tutup
                </Button>
                <Button color="danger" onPress={deleteConsume}>
                  Hapus
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DailyProteinWidget;
