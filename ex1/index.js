
// Require fs from pn for async/await support
let fs = require('pn/fs')
let {dir} = require('yargs')
            .default('dir', __dirname)
            .argv

// Mark function with 'async' to use 'await'
async function main(rootPath){
  console.log('Executing main function...')

  if (fileStat.isDirectory()) {
         main(filePath)
     }
//     try {
//         // Use 'await' to wait for the promise to resolve
//         let files = await fs.readdir(dir)
//         // console.log(files)
//         files.forEach((file) => {
//           console.log(file)
//         })
//
//
//         // Do something with files
//     // Remember to catch errors or main will fail silently
//     } catch (e) {
//         console.log(e.stack)
//     }
}

// Call main
main(dir)
