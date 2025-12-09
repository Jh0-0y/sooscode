import { useState } from "react";
import ClassDateSlider from "../ClassDateSlider";
import ClassDetailFileList from "../ClassDetailFileList";
import { generateDateRange } from "@/features/classdetail/utils/generateDateRange";

export default function FileSection({ classId }) {
  console.log("filesection");

  const dates = generateDateRange("2025-12-01", "2025-12-31", []);
  const [selectedDate, setSelectedDate] = useState(dates[0].raw);

  return (
    <div>
      <ClassDateSlider
        dates={dates}
        selected={selectedDate}
        onSelect={(d) => {
          console.log("선택 날짜:", d);
          setSelectedDate(d);
        }}
      />

      <ClassDetailFileList 
        classId={classId}
        lectureDate={selectedDate}      
      />
    </div>
  );
}
