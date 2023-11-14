import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import columnify from 'columnify'

const displayDiff = function (diff) {
    console.log(
        columnify(diff, {
            showHeaders: true,

            columnSplitter: ' | ',
        })
    )
}
function flattenDiff(diff, prefix = '') {
    let items = []

    for (const [key, value] of Object.entries(diff)) {
        const label = prefix ? `${prefix}/${key}` : key
        const val1 = value[0] ?? ''
        const val2 = value[1] ?? ''
        const reason = value[3] ?? ''
        const row = { [dir1Path]: val1, [dir2Path]: val2, Reason: reason }
        row[''] = label

        if (typeof val1 === 'object' && typeof val2 === 'object') {
            items.push(row, ...flattenDiff(value[2], label))
        } else {
            items.push(row)
        }
    }

    return items
}
function flattenDiff2(diff, prefix = '') {
    let items = []

    for (const [key, value] of Object.entries(diff)) {
        const label = prefix ? `${prefix}/${key}` : key
        const val1 = value[dir1Path] ?? ''
        const val2 = value[dir2Path] ?? ''
        const reason = value.Reason ?? ''
        const row = { [dir1Path]: val1, [dir2Path]: val2, Reason: reason }
        row[''] = label

        if (typeof val1 === 'object' && typeof val2 === 'object') {
            items.push(row, ...flattenDiff(value, label))
        } else {
            items.push(row)
        }
    }

    return items
}
function crawlDirectory(dirPath) {
    let tree = {}

    const items = fs.readdirSync(dirPath)
    items.forEach((item) => {
        const itemPath = path.join(dirPath, item)
        const stats = fs.statSync(itemPath)
        tree[item]
        if (stats.isDirectory()) {
          tree[item].type = 'folder'
            tree[item].files = crawlDirectory(itemPath)
        } else {
          tree[item].type = 'file'
            tree[item].size = stats.size
        }
    })

    return tree
}
function compareTrees2(tree1, tree2, diff) {
    for (const item in tree1) {
        if (!tree2.hasOwnProperty(item)) {
            diff[item] = {
                filename: item,
                sourceValue: chalk.gray(tree1[item]),
                targetValue: chalk.bgRed('missing'),
                reason: 'Missing',
            }
            continue
        }

        const itemType1 = typeof tree1[item]
        const itemType2 = typeof tree2[item]

        if (itemType1 !== itemType2) {
            diff[item] = {
                filename: item,
                sourceValue: chalk.gray(tree1[item]),
                targetValue: chalk.gray(tree2[item]),
                reason: chalk.yellow(`Type mismatch: ${itemType1} vs. ${itemType2}`),
            }
            continue
        }

        if (itemType1 === 'object') {
            const subDiff = {}
            compareTrees(tree1[item], tree2[item], subDiff)
            if (Object.keys(subDiff).length > 0) {
                diff[item] = subDiff
            }
        } else if (tree1[item] !== tree2[item]) {
            diff[item] = {
                filename: item,
                sourceValue: chalk.gray(tree1[item]),
                targetValue: chalk.gray(tree2[item]),
                reason: chalk.red(`Size mismatch: ${tree1[item]} vs. ${tree2[item]}`),
            }
        } else {
            diff[item] = {
                filename: item,
                sourceValue: chalk.green(tree1[item]),
                targetValue: chalk.green(tree2[item]),
                reason: chalk.green(item),
            }
        }
    }

    for (const item in tree2) {
        if (!tree1.hasOwnProperty(item)) {
            diff[item] = {
                filename: item,
                sourceValue: chalk.bgRed('missing'),
                targetValue: chalk.gray(tree2[item]),
                reason: 'Missing',
            }
        }
    }
}

function compareTrees3(tree1, tree2, diff) {
    for (const item in tree1) {
        if (!tree2.hasOwnProperty(item)) {
            diff[item] = { path1: item, path2: '', reason: 'Missing' }
            continue
        }

        const itemType1 = typeof tree1[item]
        const itemType2 = typeof tree2[item]

        if (itemType1 !== itemType2) {
            diff[item] = {
              path1: item,
              path2: item,
                reason: chalk.yellow(`Type mismatch: ${itemType1} vs. ${itemType2}`),
            }
            continue
        }

        if (itemType1 === 'object') {
            const subDiff = {}
            compareTrees(tree1[item], tree2[item], subDiff)
            if (Object.keys(subDiff).length > 0) {
                diff[item] = subDiff
            }
        } else if (tree1[item] !== tree2[item]) {
            diff[item] = {
                path1: item,
                path2: item,
                reason: chalk.red(`Size mismatch: ${tree1[item]} vs. ${tree2[item]}`),
            }
        } else {
            diff[item] = { path1: item, path2: item, reason: '' }
        }
    }

    for (const item in tree2) {
        if (!tree1.hasOwnProperty(item)) {
            diff[item] = { path1: '', path2:item, reason: 'Missing' }
        }
    }
}

function compareTrees(tree1, tree2, diff) {
    for (const item in tree1) {
        if (!tree2.hasOwnProperty(item)) {
            diff[item] = [item, chalk.gray(tree1[item]), chalk.bgRed('missing'), 'Missing']
            continue
        }

        const itemType1 = typeof tree1[item]
        const itemType2 = typeof tree2[item]

        if (itemType1 !== itemType2) {
            diff[item] = [
                item,
                chalk.gray(tree1[item]),
                chalk.gray(tree2[item]),
                chalk.yellow(`Type mismatch: ${itemType1} vs. ${itemType2}`),
            ]
            continue
        }

        if (itemType1 === 'object') {
            const subDiff = {}
            compareTrees(tree1[item], tree2[item], subDiff)
            if (Object.keys(subDiff).length > 0) {
                diff[item] = subDiff
            }
        } else if (tree1[item] !== tree2[item]) {
            diff[item] = [
                item,
                chalk.gray(tree1[item]),
                chalk.gray(tree2[item]),
                chalk.red(`Size mismatch: ${tree1[item]} vs. ${tree2[item]}`),
            ]
        } else {
            diff[item] = [item, chalk.green(tree1[item]), chalk.green(tree2[item]), chalk.green(item)]
        }
    }

    for (const item in tree2) {
        if (!tree1.hasOwnProperty(item)) {
            diff[item] = [item, chalk.bgRed('missing'), chalk.gray(tree2[item]), 'Missing']
        }
    }
}

const dir1Path = './test/folder1'
const dir2Path = './test/folder2'
const tree1 = crawlDirectory(dir1Path)

const tree2 = crawlDirectory(dir2Path)

let diff = {}
compareTrees3(tree1, tree2, diff)

console.log(diff)
let all = []
for (const [key, value] of Object.entries(diff)) {
    let obj = value
    all.push(value)
}
//const flatDiff = flattenDiff2(diff);

//const sortedFlatDiff = flatDiff.sort((a, b) => a[''].localeCompare(b['']));
displayDiff(all)
