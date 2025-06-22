import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Input,
  Alert,
  useDisclosure,
} from "@heroui/react";

import { Plus, Minus } from "lucide-react";

const InputProteinForm = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [namaMakanan, setNamaMakanan] = useState("");
  const [proteinValue, setProteinValue] = useState("");

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

  const totalProtein = ((parseFloat(proteinValue) || 0) * porsi).toFixed(1);
  const nama_makanan = namaMakanan;

  const postUserConsume = async (onClose) => {
    if (!namaMakanan) {
      setErrorMessage("Mohon untuk memasukkan nama makanan.");
      setErrorAlert(true);
      setSuccessAlert(false);
      return;
    }

    if (!proteinValue) {
      setErrorMessage("Mohon untuk memasukkan kadar protein makanan.");
      setErrorAlert(true);
      setSuccessAlert(false);
      return;
    }

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
        nama_makanan: nama_makanan,
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
    <div>
      <Button
        onPress={onOpen}
        className="bg-primary-600 text-white font-medium"
        size="sm"
        startContent={<Plus className="w-4 h-4" />}
      >
        Tambahkan Makanan
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-gray-800">
                Tambahkan Konsumsi Makanan
              </ModalHeader>
              <ModalBody>
                {successAlert && (
                  <Alert
                    description="Data berhasil disimpan!"
                    color="success"
                    variant="flat"
                    className="mb-3"
                  />
                )}
                {errorAlert && (
                  <Alert
                    description={errorMessage}
                    color="danger"
                    variant="flat"
                    className="mb-3"
                  />
                )}
                <Form className="flex flex-col gap-6">
                  <Input
                    value={namaMakanan}
                    onValueChange={setNamaMakanan}
                    label="Nama Makanan"
                    isRequired
                    errorMessage="Haram memasukkan nama makanan!"
                    labelPlacement="outside"
                    placeholder="Masukkan nama makanan disini"
                    type="text"
                    size="lg"
                    classNames={{
                      inputWrapper: [
                        "bg-gray-50 rounded-xl shadow-sm border border-gray-300 hover:bg-gray-100",
                      ],
                      input: [
                        "font-medium text-base",
                        "placeholder:text-sm font-normal",
                      ],
                      label: ["text-gray-800 font-medium text-sm"],
                      placeholder: "text-sm font-normal text-gray-600",
                    }}
                  />
                  <Input
                    value={proteinValue}
                    onValueChange={setProteinValue}
                    label="Kadar Protein"
                    isRequired
                    errorMessage="Haram memasukkan kadar protein makanan!"
                    labelPlacement="outside"
                    placeholder="Masukkan kandungan protein disini"
                    type="text"
                    size="lg"
                    classNames={{
                      inputWrapper: [
                        "bg-gray-50 rounded-xl shadow-sm border border-gray-300",
                      ],
                      input: [
                        "font-medium text-base",
                        "placeholder:text-sm font-normal",
                      ],
                      label: ["text-gray-800 font-medium text-sm"],
                      placeholder: "text-sm font-normal text-gray-600",
                    }}
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-gray-500 text-sm">g/100gr</span>
                      </div>
                    }
                  />
                  <div className="flex flex-row w-full mb-4">
                    <p className="text-gray-800 font-medium text-base w-full my-auto items-center">
                      Jumlah Porsi (/100gr)
                    </p>
                    <div className="flex flex-row items-center my-auto gap-1 border border-gray-300 p-1 rounded-xl shadow-sm">
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
                </Form>
              </ModalBody>
              <ModalFooter className="flex flex-col w-full">
                <Button
                  color="primary"
                  className="bg-primary-600 text-sm font-medium"
                  type="submit"
                  onPress={() => postUserConsume(onClose)}
                  sLoading={loading}
                >
                  {loading ? "Menyimpan..." : "Simpan Konsumsi Protein"}
                </Button>
                <Button
                  color="primary"
                  variant="text"
                  onPress={onClose}
                  className="text-gray-500 text-sm font-normal"
                >
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default InputProteinForm;
