
const displaySimpleList = async function ({isInDir2, isNotInDir2}) {
    console.log(
      isNotInDir2
        .map(item => {
          return item.absolutePath;
        })
        .join('\n'),
    );

};
export default displaySimpleList;
