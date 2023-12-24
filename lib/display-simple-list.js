import columnify from 'columnify';

const displaySimpleList = async function ({isInDir2, isNotInDir2}) {
 
    Global.log('Files not in dir2 but in dir1:');
    Global.log(
      isNotInDir2
        .map(item => {
          return item.absolutePath;
        })
        .join('\n'),
    );

};
export default displaySimpleList;
