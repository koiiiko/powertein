import React, { useEffect, useState } from "react";
import axios from "axios";

import { Chip, Button } from "@heroui/react";
import { Check, ChevronRight } from "lucide-react";

const HistoryProteinWidget = () => {
  return (
    <div className="flex flex-row w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm items-center">
      <div className="flex flex-col gap-2 w-full ">
        <p className="text-base font-medium text-gray-700">1 Juni 2025</p>
        <div className="flex flex-row w-full gap-3 items-center">
          <Chip
            size="sm"
            className="font-default bg-green-100 text-green-500 gap-1"
            startContent={<Check size={14} />}
          >
            Memenuhi kebutuhan harian
          </Chip>
          <p className="text-xs font-medium text-gray-500">
            Total Protein: 145g
          </p>
        </div>
      </div>
      <Button isIconOnly className="bg-transparent">
        <ChevronRight className="text-gray-400" />
      </Button>
    </div>
  );
};

export default HistoryProteinWidget;
