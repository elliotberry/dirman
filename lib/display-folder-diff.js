import columnify from 'columnify'

const display = function (arr) {
console.log(
    columnify(arr, {
        showHeaders: true,

        columnSplitter: ' | ',
    })
)
}
export default display