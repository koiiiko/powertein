import React, { useEffect, useState } from "react";
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
} from "@heroui/react";
import { EllipsisVertical, Trash2 } from "lucide-react";

const DailyProteinWidget = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="flex flex-row bg-gray-50 p-4 py-2 rounded-xl border border-gray-100 items-center gap-4">
      <div className="flex flex-col gap-1 justify-center w-full">
        <p className="text-base font-medium text-gray-600">Ayam Goreng</p>
        <p className="text-sm font-normal text-gray-400">4x100g</p>
      </div>
      <p className="text-sm font-normal text-gray-500 text-right w-full">
        Total Protein: 32gr
      </p>
      <Popover placement="right">
        <PopoverTrigger>
          <Button isIconOnly className="bg-transparent" size="sm">
            <EllipsisVertical className="w-4 h-4 text-gray-600" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2">
          <Button
            onPress={onOpen}
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
                <Button color="danger" onPress={onClose}>
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
