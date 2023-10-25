import columnify from "columnify";

const displaySimpleList = function ({ isInDir2, isNotInDir2 }) {
  console.log(
    isNotInDir2.map((item) => {
      return {
        "": item,
      };
    })
  );
};
export default  displaySimpleList;
