import React from "react";
import RecentBox from "./RecentBox";
import { data } from "react-router-dom";

const Details = ({ datas }) => {
  return (
    <div className=" mt-5 mx-10 flex justify-between items-center">
      {datas?.map((data, idx) => (
        <RecentBox key={idx} data={data} />
      ))}
    </div>
  );
};

export default Details;
