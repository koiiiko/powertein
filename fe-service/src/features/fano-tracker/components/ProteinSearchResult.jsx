import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Input,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Alert,
  useDisclosure,
} from "@heroui/react";

import { Search, Plus, Minus } from "lucide-react";

const ProteinSearchResult = ({ food }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPorsi(0);
      setSuccessAlert(false);
      setErrorAlert(false);
      setErrorMessage("");
    }
  }, [isOpen]);

  let [porsi, setPorsi] = useState(0);

  function incrementPorsi() {
    porsi = porsi + 1;
    setPorsi(porsi);
  }

  function decrementPorsi() {
    porsi = porsi - 1;
    setPorsi(porsi);
  }

  const totalProtein = (food.protein * porsi).toFixed(1);

  const postUserConsume = async (onClose) => {
    if (porsi === 0) {
      setErrorMessage("Mohon untuk memasukkan jumlah porsi makanan.");
      setErrorAlert(true);
      setSuccessAlert(false);
      return;
    }

    try {
      setLoading(true);
      setSuccessAlert(false);
      setErrorAlert(false);

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const userConsume = {
        userId: user.id,
        nama_makanan: food.namaMakanan,
        porsi: porsi,
        protein: totalProtein,
      };

      const response = await axios.post(
        "http://localhost:5000/tracker/save",
        userConsume
      );

      if (response.status === 201) {
        setSuccessAlert(true);
        setTimeout(() => {
          onClose();
          window.location.reload();
          setPorsi(0);
          setSuccessAlert(false);
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(`Gagal menyimpan data, ${error.response.data.message}`);
      } else {
        setErrorMessage("Gagal menyimpan data.", error);
      }
      setErrorAlert(true);
      setSuccessAlert(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row bg-primary-50 w-full py-4 px-6 rounded-lg shadow-sm">
      <div className="flex flex-col gap-1 w-full">
        <p className="font-medium text-base text-gray-700 items-center my-auto">
          {food.namaMakanan}
        </p>
        <p className="font-normal text-xs text-gray-500 items-center my-auto">
          {food.protein} gram protein per 100gr
        </p>
      </div>

      <Button
        isIconOnly
        aria-label="Tambahkan"
        onPress={onOpen}
        className="bg-primary-600 items-center my-auto rounded-full"
        size="sm"
      >
        <Plus className="text-white" />
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent className="p-2">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-lg font-medium text-gray-700">
                Tambahkan Konsumsi Makanan
              </ModalHeader>
              <ModalBody className="gap-6">
                {successAlert && (
                  <Alert
                    description="Data berhasil disimpan!"
                    color="success"
                    variant="flat"
                  />
                )}
                {errorAlert && (
                  <Alert
                    description={errorMessage}
                    color="danger"
                    variant="flat"
                  />
                )}
                <Input
                  isDisabled
                  defaultValue={food.namaMakanan}
                  label="Nama Makanan"
                  labelPlacement="outside"
                  type="text"
                  size="lg"
                  classNames={{
                    inputWrapper: [
                      "bg-gray-50 rounded-xl shadow-sm border border-gray-300",
                    ],
                    input: [
                      "group-data-[has-value=true]:text-black font-medium text-base",
                    ],
                    label: ["text-gray-800 font-normal text-sm"],
                  }}
                />
                <Input
                  isDisabled
                  defaultValue={food.protein}
                  label="Kadar Protein"
                  labelPlacement="outside"
                  type="text"
                  size="lg"
                  classNames={{
                    inputWrapper: [
                      "bg-gray-50 rounded-xl shadow-sm border border-gray-300",
                    ],
                    input: [
                      "group-data-[has-value=true]:text-black font-medium text-base",
                    ],
                    label: "font-base text-sm text-gray-100",
                  }}
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-gray-500 text-sm">g/100gr</span>
                    </div>
                  }
                />
                <div className="flex flex-row">
                  <p className="text-gray-500 font-normal text-sm w-full my-auto items-center">
                    Jumlah Porsi (/100gr)
                  </p>
                  <div className="flex flex-row items-center my-auto gap-1 border border-gray-200 p-1 rounded-xl shadow-sm">
                    <Button
                      isIconOnly
                      aria-label="decrement"
                      className="bg-transparent items-center my-auto rounded-full"
                      size="sm"
                      onPress={decrementPorsi}
                      isDisabled={porsi === 0}
                    >
                      <Minus className="text-gray-500 w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium text-gray-700 w-4 items-center justify-center text-center">
                      {porsi}
                    </span>
                    <Button
                      isIconOnly
                      aria-label="increment"
                      className="bg-transparent items-center my-auto rounded-full"
                      size="sm"
                      onPress={incrementPorsi}
                    >
                      <Plus className="text-gray-500 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex flex-col mt-4">
                <Button
                  className="bg-primary-600 text-white hover:bg-primary-700"
                  onPress={() => postUserConsume(onClose)}
                  startContent={<Plus />}
                  isLoading={loading}
                >
                  {loading ? "Menyimpan..." : "Tambahkan Makanan"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProteinSearchResult;
