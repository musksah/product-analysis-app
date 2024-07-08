const URL = "https://29b9-186-155-14-67.ngrok-free.app/"

export async function analizePicture(files) {
    return uploadFiles({
        toUrl: URL,
        files: files,
        method: "POST",
        headers: { Accept: "application/json" },
        begin: () => {
            // console.log('File Uploading Started...')
        },
        progress: ({ totalBytesSent, totalBytesExpectedToSend }) => {
            // console.log({ totalBytesSent, totalBytesExpectedToSend })
        },
    })
        .promise.then(({ body }) => {
            // Response Here...
            // const data = JSON.parse(body); => You can access to body here....
        })
        .catch(_ => {
           // console.log('Error')
        })
}