import RecentBox from "./RecentBox";

const Details = ({ datas, isSelected, flexWrap, setToShow }) => {
  return (
    <div
      className={`mt-3  w-full flex  ${
        flexWrap == "Yes" ? "flex-wrap" : ""
      } justify-between items-center`}
    >
      {datas?.map((data, idx) => (
        <RecentBox
          key={idx}
          data={data}
          isSelected={isSelected}
          setToShow={setToShow}
        />
      ))}
    </div>
  );
};

export default Details;
