const dotenv = require('dotenv')
dotenv.config()

const { Uploader } = require('@voicenter-team/aws-uploader')
const path = require('path')
const { version } = require(path.join(process.cwd(), 'package.json'))

const S3_BUCKET = process.env.S3_BUCKET
const S3_REGION = process.env.S3_REGION
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY

console.log('S3_BUCKET:', S3_BUCKET)

// const uploader = new Uploader({
//     region: S3_REGION,
//     silent: false,
//     credentials: {
//         accessKeyId: S3_ACCESS_KEY_ID,
//         secretAccessKey: S3_SECRET_ACCESS_KEY
//     }
// });
//
// async function deploy() {
//     try {
//         // Upload the 'dist' folder to the versioned directory
//         const deployedDirName = await uploader.proceedUploadDirectory(
//             S3_BUCKET,
//             directoryPathToDeploy,
//             targetDir
//         )
//
//         // Perform the deployment
//
//         // If deployment is successful, move the uploaded files to the backup directory
//         await uploader.moveFiles(
//             S3_BUCKET,
//             deployedDirName,
//             S3_BACK_UP_DIRECTORY_NAME
//         )
//
//         console.log('Deployment and backup completed successfully.')
//     } catch (error) {
//         console.error('Deployment failed:', error)
//     }
// }
//
// deploy()
